export interface Job {
  id: number,
  source: string,
  lang: string,
  timelimit?: number
}

export interface TestcaseJob {
  id: number, 
  input: string, 
  output: string
}

export interface RunJob extends Job {
  stdin: string
}

export interface SubmissionJob extends Job {
  testcases: Array<TestcaseJob>
}
