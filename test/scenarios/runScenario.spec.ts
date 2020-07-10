import { expect } from 'chai'
import { mkdir, rm } from 'shelljs'
import RunScenario from '../../src/tasks/scenarios/run'
import config = require('../../config.js')
import * as path from 'path'
import {RunJob} from '../../src/tasks/jobs/run'
import * as fs from 'fs'

describe('Run Scenario', () => {
  it('should Setup', async () => {
    const source = 'print("Hello World")'
    const stdin = 'World'

    const job: RunJob = {
      id: Math.floor(Math.random() * 1000),
      source: (new Buffer(source)).toString('base64'),
      lang: 'py3',
      timelimit: 5,
      scenario: 'run',
      stdin: (new Buffer(stdin)).toString('base64'),
    }

    const LANG_CONFIG = config.LANGS[job.lang]
    rm('-rf', config.RUNBOX.DIR)
    mkdir('-p', config.RUNBOX.DIR)
    const currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
    mkdir('-p', currentJobDir)

    await (new RunScenario()).setup(currentJobDir, job)

    // assertions
    const outputSource = fs.readFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE)).toString()
    expect(outputSource).to.eq(source)

    const outputStdin = fs.readFileSync(path.join(currentJobDir, 'run.stdin')).toString()
    expect(outputStdin).to.eq(stdin)
  })
})
