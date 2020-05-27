import { Result, RunResult, SubmissionResult, ProjectResult } from 'types/result'
import config = require('../../config.js')
import {exec, mkdir, rm} from 'shelljs'
import * as path from 'path'

import RunScenario from './scenarios/run'
import SubmissionScenario from './scenarios/submission'
import ProjectScenario from './scenarios/project'
import {Job } from './job'
import {RunJob} from './jobs/run'
import {SubmitJob} from './jobs/submission';
import {ProjectJob} from './jobs/project';

export function execute(job: RunJob): Promise<RunResult>
export function execute(job: SubmitJob): Promise<SubmissionResult>
export function execute(job: ProjectJob): Promise<ProjectResult>
export async function execute (job: Job) {
  // Create RUNBOX  
  const currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
  mkdir('-p', currentJobDir)

  let scenario
  if (job instanceof RunJob) {
    scenario = new RunScenario()
  } else if (job instanceof SubmitJob) {
    scenario = new SubmissionScenario()
  } else if (job instanceof ProjectJob) {
    scenario = new ProjectScenario()
  }

  // Setup RUNBOX
  await scenario.setup(currentJobDir, job)

  // Run worker
  await scenario.run(currentJobDir, job)

  // Get result
  const result = await scenario.result(currentJobDir, job)

  rm('-rf', currentJobDir)

  return result
}
