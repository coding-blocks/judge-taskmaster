export interface Job {
  id: number,
  source: string,
  lang: string,
  timelimit?: number
}

export interface Result {
  id: number,
  stderr: string
}

export interface TestcaseJob {
  id: number, 
  input: string, 
  output: string
}

export interface TestcaseResult { 
  id: number, 
  score: number, 
  time: string, 
  result: string 
}

export interface RunJob extends Job {
  stdin: string
}

export interface RunResult extends Result {
  stdout: string,
  time: number,
  code: number
}

export interface SubmissionJob extends Job {
  testcases: Array<TestcaseJob>
}

export interface SubmissionResult extends Result {
  testcases: Array<TestcaseResult>
}