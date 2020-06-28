export interface Result {
  id: number,
  scenario: string,
  stderr: string
}

export interface TestcaseResult { 
  id: number, 
  score: number, 
  time: string, 
  result: string 
}

export interface ProjectTestcaseResult {
  id: number,
  score: number,
  time: string,
  stdout: string,
  stderr: string
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
  testcases: Array<ProjectTestcaseResult>
}
