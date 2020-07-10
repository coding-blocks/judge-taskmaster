import { execute } from '../../src/tasks/'
import { expect } from 'chai'
import { SubmitJob } from "../../src/tasks/jobs/submission"
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
      id: Math.floor(Math.random() * 1000),
      lang: 'java8',
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

