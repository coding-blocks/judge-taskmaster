export interface JobConstructorOpts {
  id: number
  source: string
  lang: string
  scenario: "run" | "submit" | "project"
  timelimit?: number
} 

export class Job { 
  id: number
  source: string
  lang: string
  scenario: string
  timelimit?: number

  constructor({ id, source, lang, timelimit = 5, scenario }: JobConstructorOpts) {
    this.id = id
    this.source = source
    this.lang = lang
    this.timelimit = timelimit
    this.scenario = scenario
  }
}


