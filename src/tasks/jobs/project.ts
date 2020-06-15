import {Job, JobConstructorOpts} from '../job';

interface ProjectConstructorOpts extends JobConstructorOpts {
  problem: string,
  submissionDirs: Array<string>
}
export class ProjectJob extends Job {
  problem: string
  submissionDirs: Array<string>

  constructor({ id, source, lang, timelimit, scenario, problem, submissionDirs}: ProjectConstructorOpts) {
    super({ id, source, lang, timelimit, scenario})
    this.problem = problem
    this.submissionDirs = submissionDirs
  }
}
