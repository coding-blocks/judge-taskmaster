import { Job } from '../tasks/job';
import { Result } from './result';

export interface Scenario {
  setup(currentJobDir: string, job: Job)
  result(currentJobDir: string, jobId: number): Promise<Result>
}