import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from "../../src/tasks/jobs/submission"
import { SubmissionResult } from '../../src/types/result'

describe('submit - py2', () => {
  it('.py file submits correctly (py2)', async () => {
    const source = `
inp = raw_input()
print("Hello " + inp)
  `

    const submitResult = await execute(new SubmitJob({
      id: Math.floor(Math.random() * 1000),
      lang: 'py2',
      source: (new Buffer(source)).toString('base64'),
      scenario: 'submit',
      testcases: [{
        id: Math.floor(Math.random() * 1000),
        input: 'https://minio.cb.lk/public/input',
        output: 'https://minio.cb.lk/public/output'
      }]
    }))

    // assertions
    expect(submitResult.testcases[0].result).to.eq('Success')
    expect(submitResult.testcases[0].score).to.eq(100)
  })
})

