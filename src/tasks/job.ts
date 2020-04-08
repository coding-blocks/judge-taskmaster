type JobConstructorOpts = {
  id: number
  source: string
  lang: string
  timelimit?: number
} 
type RunJobConstructorOpts = JobConstructorOpts & {
  stdin: string
}
type TestcaseOpts = {
  id: number, 
  input: string, 
  output: string
}
type SubmitJobConstructorOpts = JobConstructorOpts & {
  testcases: Array<TestcaseOpts>
}

export class Job { 
  id: number
  source: string
  lang: string
  timelimit?: number

  constructor({ id, source, lang, timelimit = 5 }: JobConstructorOpts) {
    this.id = id
    this.source = source
    this.lang = lang
    this.timelimit = timelimit
  }
}

export class RunJob extends Job {
  stdin: string

  constructor({ id, source, lang, timelimit, stdin }: RunJobConstructorOpts) {
    super({id, source, lang, timelimit})
    this.stdin = stdin
  }
}

export class SubmitJob extends Job {
  testcases: Array<TestcaseOpts>

  constructor({ id, source, lang, timelimit, testcases }: SubmitJobConstructorOpts) {
    super({id, source, lang, timelimit})
    this.testcases = testcases
  }
}
