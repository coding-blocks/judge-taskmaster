interface JobConstructorOpts {
  id: number
  source: string
  lang: string
  scenario: "run" | "submit" | "project"
  timelimit?: number
} 
interface RunJobConstructorOpts extends JobConstructorOpts {
  stdin: string
}
interface TestcaseOpts {
  id: number, 
  input: string, 
  output: string
}
interface SubmitJobConstructorOpts extends JobConstructorOpts {
  testcases: Array<TestcaseOpts>
}

interface ProjectConstructorOpts extends JobConstructorOpts {
  problem: string
}

export class Job { 
  id: number
  source: string
  lang: string
  scenario: string
  timelimit?: number

  constructor({ id, source, lang, timelimit = 5, scenario }: JobConstructorOpts) {
    this.id = id
    this.source = source
    this.lang = lang
    this.timelimit = timelimit
    this.scenario = scenario
  }
}

export class RunJob extends Job {
  stdin: string

  constructor({ id, source, lang, timelimit, scenario, stdin }: RunJobConstructorOpts) {
    super({id, source, lang, timelimit, scenario})
    this.stdin = stdin
  }
}

export class SubmitJob extends Job {
  testcases: Array<TestcaseOpts>

  constructor({ id, source, lang, timelimit, scenario, testcases }: SubmitJobConstructorOpts) {
    super({id, source, lang, timelimit, scenario})
    this.testcases = testcases
  }
}

export class ProjectJob extends Job {
  problem: string

  constructor({ id, source, lang, timelimit, scenario, problem}: ProjectConstructorOpts) {
    super({ id, source, lang, timelimit, scenario})
    this.problem = problem
  }
}
