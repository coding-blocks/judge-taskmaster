import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from "../../src/tasks/jobs/submission"
import { SubmissionResult } from '../../src/types/result'

describe('submit - csharp', () => {
  it('.cs file submits correctly', async () => {
    const source = `
    using System;
    public class HelloWorld {
      static public void Main () {
        Console.WriteLine ("Hello " + Console.ReadLine());
      }
    }
    `
    const submitResult = await execute(new SubmitJob({
      id: 3,
      lang: 'csharp',
      source: (new Buffer(source)).toString('base64'),
      scenario: 'submit',
      testcases: [{
        id: 1,
        input: 'https://minio.cb.lk/public/input',
        output: 'https://minio.cb.lk/public/output'
      }]
    }))

    //assertion
    expect(submitResult.testcases[0].result).to.eq('Success')
    expect(submitResult.testcases[0].score).to.eq(100)

  })
})
