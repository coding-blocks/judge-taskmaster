import { Job, Result } from "./job";

export interface Scenario {
  setup(currentJobDir: string, job: Job)
  result(currentJobDir: string, jobId: number): Promise<Result>
}