import config = require('../../../config.js')
import { cat, exec, mkdir, rm} from 'shelljs'
import { ProjectJob } from '../jobs/project'
import { ProjectResult } from 'types/result'
import * as path from 'path'
import { Scenario } from 'tasks/scenario'
import { download } from 'utils/request'

export default class ProjectScenario extends Scenario {
  async setup(currentJobDir: string, job: ProjectJob) {
    const problemBundlePath = path.join(currentJobDir, 'problem.git')
    const solutionBundlePath = path.join(currentJobDir, 'solution.git')
    await Promise.all([
      download(job.problem, problemBundlePath),
      download(job.source, solutionBundlePath)
    ])

    exec(`git clone ${currentJobDir}/problem.git ${currentJobDir}/problem`)
    exec(`git clone ${currentJobDir}/solution.git ${currentJobDir}/solution`)
  }

  run(currentJobDir: string, job: ProjectJob) {
    const PROJECT_CONFIG = config.PROJECT[job.lang]
    return exec(`docker run \\
        --cpus="${PROJECT_CONFIG.CPU_SHARE}" \\
        --memory="${PROJECT_CONFIG.MEM_LIMIT}" \\
        --rm \\
        -v "${currentJobDir}":/usr/src/runbox \\
        -w /usr/src/runbox codingblocks/project-worker-"${job.lang}" \\
        /bin/judge.py -t ${job.timelimit || 5} -l ${job.lockedFiles.join(' ')}
    `);
  }

  async result(currentJobDir: string, job: ProjectJob): Promise<ProjectResult> {
    const result_code = cat(path.join(currentJobDir, 'result.code')).toString() || '1'
    const result_time = cat(path.join(currentJobDir, 'result.time').toString())
    
    const result_stderr = cat(path.join(currentJobDir, 'result.stderr')).toString()
    const build_stderr = cat(path.join(currentJobDir, 'build.stderr')).toString()
    const run_stderr = cat(path.join(currentJobDir, 'run.stderr')).toString()

    const stdout = cat(path.join(currentJobDir, 'run.stdout')).toString()
    const stderr = result_stderr || build_stderr || run_stderr

    const score = +result_code === 0 ? 100 : 0

    return {
      id: job.id,
      scenario: 'project',
      stderr: (new Buffer(stderr)).toString('base64'),
      stdout: (new Buffer(stdout)).toString('base64'),
      code: +result_code,
      time: +result_time,
      score
    }
  }
}
