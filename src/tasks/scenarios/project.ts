import config = require('../../../config.js')
import { cat, exec, mkdir} from 'shelljs'
import { ProjectJob } from '../jobs/project'
import { ProjectResult } from 'types/result'
import * as path from 'path'
import { Scenario } from 'tasks/scenario'
import { download } from 'utils/request'

export default class ProjectScenario extends Scenario {
  async setup(currentJobDir: string, job: ProjectJob) {
    const problemZipDir = path.join(currentJobDir, 'problem.zip')
    const solutionZipDir = path.join(currentJobDir, 'solution.zip')
    await download(job.problem, problemZipDir)
    await download(job.source, solutionZipDir)

    const problemDir = path.join(currentJobDir, 'problem')
    mkdir('-p', problemDir)
    exec(`unzip ${problemZipDir} -d ${problemDir}`)

    const solutionDir = path.join(currentJobDir, 'solution')
    mkdir('-p', solutionDir)
    exec(`unzip ${solutionZipDir} -d ${solutionDir}`)
  }

  run(currentJobDir: string, job: ProjectJob) {
    const PROJECT_CONFIG = config.PROJECT[job.lang]
    return exec(`docker run \\
        --cpus="${PROJECT_CONFIG.CPU_SHARE}" \\
        --memory="${PROJECT_CONFIG.MEM_LIMIT}" \\
        --rm \\
        -v "${currentJobDir}":/usr/src/runbox \\
        -w /usr/src/runbox codingblocks/project-worker-"${job.lang}" \\
        /bin/judge.sh -s "${job.submissionDirs}"
    `);
  }

  async result(currentJobDir: string, job: ProjectJob): Promise<ProjectResult> {
    const result_code = cat(path.join(currentJobDir, 'result.code')).toString()
    const result_time = cat(path.join(currentJobDir, 'result.time').toString())
    
    const result_stderr = cat(path.join(currentJobDir, 'result.stderr')).toString()
    const build_stderr = cat(path.join(currentJobDir, 'build.stderr')).toString()
    const run_stderr = cat(path.join(currentJobDir, 'run.stderr')).toString()
    const run_stdout = cat(path.join(currentJobDir, 'run.stdout')).toString()

    const score = +result_code === 0 ? 100 : 0

    return {
      id: job.id,
      stderr: result_stderr || build_stderr || run_stderr,
      stdout: run_stdout,
      code: +result_code,
      time: +result_time,
      score
    }
  }
}
