import { RunJob, SubmissionJob, RunResult, SubmissionResult } from "types/job";
import config = require('../../config.js')
import {exec, mkdir, rm} from 'shelljs'
import * as path from 'path'

import RunScenario from './run'
import SubmissionScenario from './submission'

export const executor = async (job: RunJob|SubmissionJob): Promise<RunResult|SubmissionResult> => {
  // Create RUNBOX
  rm('-rf', config.RUNBOX.DIR)
  mkdir('-p', config.RUNBOX.DIR)
  const currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
  mkdir('-p', currentJobDir)

  const LANG_CONFIG = config.LANGS[job.lang]
  const scenario = job.hasOwnProperty('testcases') ? SubmissionScenario : RunScenario

  // Setup RUNBOX
  await scenario.setup(currentJobDir, <RunJob&SubmissionJob>job) // TODO:

  // Run worker
  exec(`docker run \\
    --cpus="${LANG_CONFIG.CPU_SHARE}" \\
    --memory="${LANG_CONFIG.MEM_LIMIT}" \\
    --ulimit nofile=64:64 \\
    --rm \\
    --read-only \\
    -v "${currentJobDir}":/usr/src/runbox \\
    -w /usr/src/runbox \\
    codingblocks/judge-worker-${job.lang} \\
    /bin/judge.sh -t ${job.timelimit || 5} 
  `)

  // Get result
  const result = await scenario.result(currentJobDir, job.id)

  rm('-rf', currentJobDir)

  return result
}
