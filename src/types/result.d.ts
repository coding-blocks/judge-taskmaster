export type Result = {
  id: number,
  stderr: string
}

export type TestcaseResult = { 
  id: number, 
  score: number, 
  time: string, 
  result: string 
}

export type RunResult = Result & {
  stdout: string,
  time: number,
  code: number
}

export type SubmissionResult = Result & {
  testcases: Array<TestcaseResult>
}
