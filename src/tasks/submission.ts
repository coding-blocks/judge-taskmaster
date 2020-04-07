import config = require('../../config.js')
import { cat, exec, mkdir, rm } from 'shelljs'
import { SubmissionJob, SubmissionResult } from '../types/job'
import * as path from 'path'
import * as fs from 'fs'
import http = require('http')
import { Scenario } from 'types/scenario.js'

rm('-rf', config.RUNBOX.DIR)
mkdir('-p', config.RUNBOX.DIR)

class SubmissionScenario implements Scenario {
  setup(currentJobDir: string, job: SubmissionJob) {
    const LANG_CONFIG = config.LANGS[job.lang]

    job.testcases.map(testcase => {
      mkdir('-p', `currentJobDir/${testcase.id}`)
      // const file = fs.createWriteStream();
      Promise.all([http.get(testcase.input), http.get(testcase.output)])
        .then(values => {
          values.map(value => {
  
          })
        })
    })
    fs.writeFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE),
      (new Buffer(job.source, 'base64')).toString('ascii'))
    fs.writeFileSync(path.join(currentJobDir, ),
      (new Buffer(job.testcases)))
  }

  async result(currentJobDir: string): Promise<SubmissionResult> {
    // TODO
    return {

    }
  }
}

export default new SubmissionScenario()
