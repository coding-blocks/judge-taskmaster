import { RunJob, SubmissionJob, Job } from "types/job";
import { RunResult, SubmissionResult, Result } from 'types/result'
import config = require('../../config.js')
import {exec, mkdir, rm} from 'shelljs'
import * as path from 'path'

import RunScenario from './run'
import SubmissionScenario from './submission'
import { Scenario } from "types/scenario";

export const executor = <J, R>(scenario: Scenario) => async (job: Job & J): Promise<Result & R> => {
  // Create RUNBOX
  rm('-rf', config.RUNBOX.DIR)
  mkdir('-p', config.RUNBOX.DIR)
  const currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
  mkdir('-p', currentJobDir)

  const LANG_CONFIG = config.LANGS[job.lang]

  // Setup RUNBOX
  await scenario.setup(currentJobDir, job) // TODO:

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
  const result = <Result & R>(await scenario.result(currentJobDir, job.id))

  rm('-rf', currentJobDir)

  return result
}

export const runExecutor = executor<RunJob, RunResult>(RunScenario)
export const submissionExecutor = executor<SubmissionJob, SubmissionResult>(SubmissionScenario)
