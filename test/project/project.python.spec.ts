import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { ProjectJob } from "../../src/tasks/jobs/project"

describe('project - python', () => {
  it('nodejs project submits correctly', async () => {
    const result = await execute(new ProjectJob({
      id: Math.floor(Math.random() * 1000),
      lang: 'python',
      source: 'https://minio.cb.lk/hackerblocks/python-solution.zip',
      problem: 'https://minio.cb.lk/hackerblocks/python-problem.zip',
      config: `
project:
  allowed-folders:
    - main/
  before-test:
    - pip install -r requirements.txt
  testcases:
    - python manage.py test tests/*
      `,
      scenario: 'project',
      timelimit: 60
    }))

    // assertions
    expect(result.testcases[0].score).to.eq(100)
  })
})

