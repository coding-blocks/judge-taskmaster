import { mkdir } from 'shelljs'
import { expect } from 'chai'
import config = require('../../config.js')
import * as path from 'path'
import { ProjectJob } from '../../src/tasks/jobs/project'
import ProjectScenario from '../../src/tasks/scenarios/project'

describe('Project Scenario', () => {
  it('should setup', async () => {
    const job: ProjectJob = new ProjectJob({
      id: 4,
      lang: 'nodejs',
      source: 'https://minio.cb.lk/hackerblocks/sample-solution.zip',
      problem: 'https://minio.cb.lk/hackerblocks/sample-problem_2.zip',
      config: `
project:
  allowed-folders:
    - src/
  before-test:
    - yarn install
    - yarn build
  testcases:
    - yarn test
      `,
      scenario: 'project'
    })

    const currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
    mkdir('-p', currentJobDir)
    const scenario = new ProjectScenario()
    await scenario.setup(currentJobDir, job)
    
    expect(1).to.be.equal(1)
  })
})
