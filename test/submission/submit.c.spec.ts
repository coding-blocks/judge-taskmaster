import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from '../../src/tasks/job'
import { SubmissionResult } from '../../src/types/result'

describe('submit - c', () => {
  it('.c file submits correctly', async () => {
    const source = `
    #include <stdio.h>
    int main () {
        char in[10];
        scanf("%s", in);
        printf("Hello %s", in);
        return 0;
    }
  `

    const submitResult = await execute(new SubmitJob({
      id: 1,
      lang: 'c',
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

