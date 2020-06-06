export interface Result {
  id: number,
  stderr: string
}

export interface TestcaseResult { 
  id: number, 
  score: number, 
  time: string, 
  result: string 
}

export interface RunResult extends Result {
  stdout: string,
  time: number,
  code: number
}

export interface SubmissionResult extends Result {
  testcases: Array<TestcaseResult>
}

export interface ProjectResult extends Result {
  stdout: string,
  code: number,
  time: number,
  score: number
}
