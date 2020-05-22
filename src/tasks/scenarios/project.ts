import config = require('../../../config.js')
import {cat, exec, mkdir, rm, touch, head} from 'shelljs'
import {ProjectJob} from 'tasks/job'
import { ProjectResult } from 'types/result'
import * as path from 'path'
import { Scenario } from 'tasks/scenario'
import { download } from 'utils/request'

export default class ProjectScenario extends Scenario {
  async setup(currentJobDir: string, job: ProjectJob) {
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
    `)
  }

  async result(currentJobDir: string, job: ProjectJob): Promise<ProjectResult> {
    // TODO

    return {
      id: job.id,
      stderr: '',
      stdout: '',
      time: 0,
      code: 0,
      score: 0
    }
  }
}
