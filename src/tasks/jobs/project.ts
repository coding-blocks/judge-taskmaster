import {Job, JobConstructorOpts} from '../job';

interface ProjectConstructorOpts extends JobConstructorOpts {
  problem: string,
  config: string
}
export class ProjectJob extends Job {
  problem: string
  config: string

  constructor({ id, source, lang, timelimit, scenario, problem, config}: ProjectConstructorOpts) {
    super({ id, source, lang, timelimit, scenario})
    this.problem = problem
    this.config = config
  }
}
