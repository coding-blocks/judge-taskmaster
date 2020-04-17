import config = require('../../../config.js')
import {cat, exec, mkdir, rm, touch, head} from 'shelljs'
import { RunJob } from '../job'
import { RunResult } from 'types/result'
import * as path from 'path'
import * as fs from 'fs'
import { Scenario } from '../scenario'

class RunScenario extends Scenario {
  setup(currentJobDir: string, job: RunJob) {
    const LANG_CONFIG = config.LANGS[job.lang]

    fs.writeFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE),
      (new Buffer(job.source, 'base64')).toString('ascii'))
    fs.writeFileSync(path.join(currentJobDir, 'run.stdin'),
      (new Buffer(job.stdin, 'base64')).toString('ascii'))    
  }

  async result(currentJobDir: string, job: RunJob): Promise<RunResult> {
    const stdout = exec(`
      head -c ${config.MAX_OUTPUT_BUFFER} ${path.join(currentJobDir, 'run.stdout')}
    `)

    // Check for compile_stderr if can't find a stdout file ; stdout can be ''
    const compile_stderr = cat(path.join(currentJobDir, 'compile.stderr')).toString()
    let stderr = compile_stderr || cat((path.join(currentJobDir, 'run.stderr')).toString())

    const run_time = cat(path.join(currentJobDir, 'runguard.time')).toString()
    const code = cat(path.join(currentJobDir, 'runguard.code')).toString()

    return {
      id: job.id,
      stderr: (new Buffer(stderr)).toString('base64'),
      stdout: (new Buffer(stdout)).toString('base64'),
      time: +run_time,
      code: +code
    }
  }
}

export default new RunScenario()
