import config = require('../../config.js')
import { cat, exec, mkdir, rm } from 'shelljs'
import { SubmissionJob, SubmissionResult } from '../types/job'
import * as path from 'path'
import * as fs from 'fs'
import * as https from 'https'
import { Scenario } from 'types/scenario.js'
import { ClientRequest } from 'http';

export const download = (url: string, dest: string): Promise<ClientRequest> => {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) =>
    https.get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        resolve()
      });
    }).on('error', err => {
      reject(err)
    })
  )
}

class SubmissionScenario implements Scenario {
  setup(currentJobDir: string, job: SubmissionJob) {
    const LANG_CONFIG = config.LANGS[job.lang]

    fs.writeFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE),
      (new Buffer(job.source, 'base64')).toString('ascii'))
    const testCasesDir = path.join(currentJobDir, 'testcases')
    mkdir('-p', testCasesDir)

    job.testcases.map(async testcase => {
      const rootDir = path.join(testCasesDir, '' + testcase.id)
      mkdir('-p', rootDir)
      const input = await download(testcase.input, rootDir)
      const output = await download(testcase.output, rootDir)
    })

  }

  async result(currentJobDir: string): Promise<SubmissionResult> {
    // TODO
    return Promise.resolve({
      id: 1,
      stderr: '',
      testcases: []
    })
  }
}

export default new SubmissionScenario()
