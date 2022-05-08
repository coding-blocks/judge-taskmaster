import {Job, JobConstructorOpts} from '../job';

interface TestcaseOpts {
  id: number,
  input: string,
  output: string
  timelimit: string
  memorylimit: string
}

interface SubmitJobConstructorOpts extends JobConstructorOpts {
  testcases: Array<TestcaseOpts>
}

export class SubmitJob extends Job {
  testcases: Array<TestcaseOpts>

  constructor({ id, source, lang, timelimit, scenario, testcases }: SubmitJobConstructorOpts) {
    super({id, source, lang, timelimit, scenario})
    this.testcases = testcases
  }
}
