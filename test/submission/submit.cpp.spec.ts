import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from "../../src/tasks/jobs/submission"
import { SubmissionResult } from '../../src/types/result'

describe('submit - cpp', () => {
  it('.cpp file submits correctly', async () => {
    const source = `
      #include <iostream>
      using namespace std;
      int main () {
          char in[10];
          cin>>in;
          cout<<"Hello "<<in;
          return 0;
      }`

    const submitResult = await execute(new SubmitJob({
      id: 1,
      lang: 'cpp',
      source: (new Buffer(source)).toString('base64'),
      scenario: 'submit',
      testcases: [{
        id: 1,
        input: 'https://minio.cb.lk/public/input',
        output: 'https://minio.cb.lk/public/output'
      }]
    }))

    // assertions
    expect(submitResult.testcases[0].result).to.eq('Success')
    expect(submitResult.testcases[0].score).to.eq(100)
  })

  it('.cpp files generates errors', async () => {
    const source = `
      #include <iostream>
      using namespace std;
      int main () {`    
    const submitResult = await execute(new SubmitJob({
      id: 2,
      lang: 'cpp',
      source: (new Buffer(source)).toString('base64'),
      scenario: 'submit',
      testcases: [{
        id: 1,
        input: 'https://minio.cb.lk/public/input',
        output: 'https://minio.cb.lk/public/output'
      }]
    }))

    expect(submitResult.stderr).to.not.eq('')
  })
})

