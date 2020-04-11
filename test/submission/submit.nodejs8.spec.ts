import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from '../../src/tasks/job'
import { SubmissionResult } from '../../src/types/result'

describe('submit - nodejs8', () => {
  it('.js file submits correctly (nodejs8)', async () => {
    const source = `
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    rl.on('line', function (line) {
      console.log("Hello " + line);
    })
  `

    const submitResult = await execute(new SubmitJob({
      id: 1,
      lang: 'nodejs8',
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

