import { expect } from 'chai'
import { ProjectJob } from '../../src/tasks/job'
import ProjectScenarion from '../../src/tasks/scenarios/project'

describe('Project Scenario', () => {
  it('should setup', async () => {
    const job: ProjectJob = {
      id: 1,
      source: '',
      lang: 'nodejs',
      timelimit: 20,
      scenario: 'problem',
      problem: ''
    }
  })
})
