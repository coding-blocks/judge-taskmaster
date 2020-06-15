import {Job, JobConstructorOpts} from '../job';

interface ProjectConstructorOpts extends JobConstructorOpts {
  problem: string,
  lockedFiles: Array<string>
}
export class ProjectJob extends Job {
  problem: string
  lockedFiles: Array<string>

  constructor({ id, source, lang, timelimit, scenario, problem, lockedFiles}: ProjectConstructorOpts) {
    super({ id, source, lang, timelimit, scenario})
    this.problem = problem
    this.lockedFiles = lockedFiles
  }
}
