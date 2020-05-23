import {Job, JobConstructorOpts} from '../job';

interface RunJobConstructorOpts extends JobConstructorOpts {
  stdin: string
}

export class RunJob extends Job {
  stdin: string

  constructor({ id, source, lang, timelimit, scenario, stdin }: RunJobConstructorOpts) {
    super({id, source, lang, timelimit, scenario})
    this.stdin = stdin
  }
}