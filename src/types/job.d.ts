export interface RunJob {
  source: string,
  lang: string,
  stdin: string,
  timelimit?: number,
  id: number
}

export interface RunResult {
  stdout: string,
  stderr: string,
  time: number,
  code: number
  id: number
}

export interface SubmissionJob {
  id: number
  source: string,
  lang: string,
  timelimit?: number,
  testcases: [{ id: number, input: string, output: string }],
}

export interface SubmissionResult {
  id: number,
  stderr: string,
  testcases: [{ id: number, sscore: number, time: string, result: string }]
}