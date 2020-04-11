import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from '../../src/tasks/job'
import { SubmissionResult } from '../../src/types/result'

describe('submit - java8', () => {
  it('.java file submits correctly (java8)', async () => {
    const source = `
    import java.util.Scanner;
    public class Main {
      public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String input = in.next();
        System.out.println("Hello " + input);
      }
    }
  `

    const submitResult = await execute(new SubmitJob({
      id: 1,
      lang: 'java8',
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

