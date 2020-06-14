import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { ProjectJob } from "../../src/tasks/jobs/project"

describe('submit - nodejs', () => {
  it('nodejs project submits correctly', async () => {
    const result = await execute(new ProjectJob({
      id: 4,
      lang: 'nodejs',
      source: 'http://127.0.0.1:8000/solution.zip',
      problem: 'http://127.0.0.1:8000/problem.zip',
      submissionDirs: 'src/*',
      scenario: 'project'
    }))

    // assertions
    expect(result.stderr).to.be.equal('')
    expect(result.stdout).to.be.not.equal('')
    expect(result.score).to.be.equal(100)
  })
})

