import config = require('../../../config.js')
import {cat, exec, mkdir, rm, touch, head} from 'shelljs'
import {ProjectJob} from 'tasks/job'
import { ProjectResult } from 'types/result'
import * as path from 'path'
import { Scenario } from 'tasks/scenario'
import { download } from 'utils/request'

export default class ProjectScenario extends Scenario {
  async setup(currentJobDir: string, job: ProjectJob) {
    // check this. directory might be wrong
    const problemDir = path.join(currentJobDir, 'problem')
    mkdir('-p', problemDir)
    await download(job.problem, path.join(problemDir, 'problem'))

    const solutionDir = path.join(currentJobDir, 'solution')
    mkdir('-p', solutionDir)
    await download(job.source, path.join(solutionDir, 'solution'))
  }

  run(currentJobDir: string, job: ProjectJob) {
    const LANG_CONFIG = config.LANGS[job.lang]
    return exec(`docker run \\
        --cpus="${LANG_CONFIG.CPU_SHARE}" \\
        --memory="${LANG_CONFIG.MEM_LIMIT}" \\
        --rm \\
        -v "${currentJobDir}":/usr/src/runbox \\
        -w /usr/src/runbox codingblocks/project-worker-"${job.lang}" \\
        /bin/judge.sh -s "${job.submissionDirs}"
    `);
  }

  async result(currentJobDir: string, job: ProjectJob): Promise<ProjectResult> {

    const result_code = cat(path.join(currentJobDir, 'result.code')).toString()

    if (result_code) {
      // problem hash and solution hash were not equal. // error
      return {
        id: job.id,
        stderr: cat(path.join(currentJobDir, 'result.stderr')).toString(),
        stdout: '',
        code: parseInt(result_code),
        time: 1,
        score: 0
      }
    }

    const build_stderr = cat(path.join(currentJobDir, 'build.stderr')).toString()
    const stderr = build_stderr || cat((path.join(currentJobDir, 'run.stderr')).toString())

    if (stderr) {
      return {
        id: job.id,
        stderr: build_stderr,
        stdout: '',
        code: 12123,
        time: 1,
        score: 0
      }
    }

    const build_stdout = cat(path.join(currentJobDir, 'build.stdout')).toString()
    const stdout = build_stdout || cat(path.join(currentJobDir, 'run.stdout')).toString()

    return {
      id: job.id,
      stderr: '',
      stdout: stdout,
      time: 0,
      code: 0,
      score: 0
    }
  }
}
