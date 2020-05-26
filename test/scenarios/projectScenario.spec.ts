import { assert } from 'chai'
import { ProjectJob } from '../../src/tasks/jobs/project';
import config = require('../../config.js')
import ProjectScenario from '../../src/tasks/scenarios/project'
import {mkdir, rm} from "shelljs";
import * as path from "path";
import * as fs from 'fs'


describe('Project Scenario', () => {
  it('should setup', async () => {
    const job: ProjectJob = {
      id: 1,
      source: 'https://minio.cb.lk/public/problem.zip',
      problem: 'https://minio.cb.lk/public/solution.zip',
      submissionDirs: 'src/*',
      lang: 'nodejs',
      timelimit: 20,
      scenario: 'problem'
    }

    rm('-rf', config.RUNBOX.DIR)
    mkdir('-p', config.RUNBOX.DIR)
    const currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
    mkdir('-p', currentJobDir)

    await (new ProjectScenario()).setup(currentJobDir, job)

    assert.isOk(fs.existsSync(path.join(currentJobDir, 'problem')))
    assert.isOk(fs.existsSync(path.join(currentJobDir, 'solution')));
  })
})
