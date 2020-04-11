import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from '../../src/tasks/job'
import { SubmissionResult } from '../../src/types/result'

describe('submit - py3', () => {
  it('.py file submits correctly (py3)', async () => {
    const source = `
inp = input()
print("Hello " + inp)
  `

    const submitResult = await execute(new SubmitJob({
      id: 1,
      lang: 'py3',
      source: (new Buffer(source)).toString('base64'),
      testcases: [{
        id: 1,
        input: 'https://minio.cb.lk/public/input',
        output: 'https://minio.cb.lk/public/output'
      }]
    }))

    console.log(submitResult)

    // assertions
    expect(submitResult.testcases[0].result).to.eq('Success')
    expect(submitResult.testcases[0].score).to.eq(100)
  })
})

