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
  id: number,
  source: string,
  lang: string,
  testcases: [{input: string, output: string}]
  getstdout: boolean,
}

export interface SubmissionResult {
  id: number,
  results: [{resultcode: number, stdout?: string, stderr?: string}]
}