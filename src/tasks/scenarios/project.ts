import config = require('../../../config.js')
import { cat, exec, mkdir, rm, touch, head } from 'shelljs'
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
    let result_code = cat(path.join(currentJobDir, 'result.code')).toString()
    if (result_code) {
      //problem hash and solution hash were not equal
      return {
        id: job.id,
        stderr: cat(path.join(currentJobDir, 'result.stderr')).toString(),
        stdout: '',
        code: parseInt(result_code),
        time: 0,
        score: 0
      }
    }

    // if hashes were equal, result_code will be found inside solution directory
    const solutionDir = path.join(currentJobDir, 'solution')
    result_code = cat(path.join(solutionDir, 'result.code')).toString()
    const result_time = cat(path.join(solutionDir, 'result.time')).toString()
    const build_stderr = cat(path.join(currentJobDir, 'build.stderr')).toString()

    if (build_stderr) {
      return {
        id: job.id,
        stderr: build_stderr,
        stdout: '',
        code: parseInt(result_code),
        time: parseFloat(result_time),
        score: 0
      }
    }

    return {
      id: job.id,
      stderr: cat((path.join(currentJobDir, 'run.stderr')).toString()),
      stdout: cat(path.join(currentJobDir, 'run.stdout')).toString(),
      code: parseInt(result_code),
      time: parseFloat(result_time),
      score: parseInt(result_code) === 0 ? 100 : 0
    }
  }
}
