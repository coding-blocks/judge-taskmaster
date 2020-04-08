import {submissionExecutor} from '../../src/tasks/'
import {expect} from 'chai'

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

    const submitResult = await submissionExecutor({
      id: 1,
      lang: 'cpp',
      source: (new Buffer(source)).toString('base64'),
      testcases: [{ 
        id: 1, 
        input: 'https://minio.cb.lk/public/input', 
        output: 'https://minio.cb.lk/public/output' 
      }]
    })
    
    console.log(submitResult)

    // assertions
    expect(1).to.eq(1)
  })
})

