import { Result, RunResult, SubmissionResult } from 'types/result'
import config = require('../../config.js')
import {exec, mkdir, rm} from 'shelljs'
import * as path from 'path'

import RunScenario from './run'
import SubmissionScenario from './submission'
import { RunJob, SubmitJob, Job } from "./job";

export function execute(job: RunJob): Promise<RunResult>
export function execute(job: SubmitJob): Promise<SubmissionResult>
export async function execute (job: Job) {
  // Create RUNBOX  
  const currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
  mkdir('-p', currentJobDir)

  const LANG_CONFIG = config.LANGS[job.lang]

  let scenario
  if (job instanceof RunJob) {
    scenario = RunScenario
  } else if (job instanceof SubmitJob) {
    scenario = SubmissionScenario
  }

  // Setup RUNBOX
  await scenario.setup(currentJobDir, job) // TODO:

  // Run worker
  exec(`docker run \\
    --cpus="${LANG_CONFIG.CPU_SHARE}" \\
    --memory="${LANG_CONFIG.MEM_LIMIT}" \\
    --ulimit nofile=64:64 \\
    --rm \\
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
