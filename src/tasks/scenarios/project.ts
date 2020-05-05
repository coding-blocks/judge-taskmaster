import config = require('../../../config.js')
import {cat, exec, mkdir, rm, touch, head} from 'shelljs'
import { ProjectJob } from 'tasks/job'
import { ProjectResult } from 'types/result'
import * as path from 'path'
import * as fs from 'fs'
import { Scenario } from 'tasks/scenario'
import { download } from 'utils/request'

export default class ProjectScenario extends Scenario {
  async setup(currentJobDir: string, job: ProjectJob) {
    // TODO
    const problemDir = path.join(currentJobDir, job.problem)
    await download(job.problem, problemDir)

    const solutionDir = path.join(currentJobDir, job.source)
    await download(job.problem, solutionDir)
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
