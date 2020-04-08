import config = require('../../config.js')
import { cat, ls, mkdir, exec } from 'shelljs'
import { SubmissionJob } from 'types/job'
import { SubmissionResult } from 'types/result'
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

    return Promise.all(job.testcases.map(async testcase => {
      const rootDir = path.join(testCasesDir, '' + testcase.id)
      mkdir('-p', rootDir)
      console.log(rootDir)
      const input = await download(testcase.input, path.join(rootDir, 'stdin'))
      const output = await download(testcase.output, path.join(rootDir, 'stdout'))
    }))
  }

  async result(currentJobDir: string, jobId: number): Promise<SubmissionResult> {
    // Check for compile_stderr if can't find a stdout file ; stdout can be ''
    const compile_stderr = cat(path.join(currentJobDir, 'compile.stderr')).toString()

    if (compile_stderr) {
      return {
        id: jobId,
        stderr: compile_stderr,
        testcases: []
      }
    }

    const testcases = ls(path.join(currentJobDir, 'testcases')).map(testcase => {
      const currentTestcasePath = path.join(currentJobDir, 'testcases', testcase)

      const stderr = cat(path.join(currentTestcasePath, 'run.stderr')).toString()
      const time = cat(path.join(currentTestcasePath, 'runguard.time')).toString().trim()
      const code = cat(path.join(currentTestcasePath, 'runguard.code')).toString()

      const runOutputFile = path.join(currentTestcasePath, 'run.stdout')
      const expectedOutputFile = path.join(currentTestcasePath, 'stdout')

      const result = new Array(
        +code === 143 && "TLE",
        +code === 137 && "MLE",
        +code !== 0 && "Run Error",
        +code === 0 && "Success"
      ).reduce((acc, cur) => acc || cur)
      
      const diff = exec(`
        diff -b -a ${runOutputFile} ${expectedOutputFile}
      `)

      return {
        id: +testcase,
        time,
        result,
        score: diff.code === 0 ? 100 : 0
      }
    })

    return {
      id: jobId,
      stderr: compile_stderr,
      testcases
    }
  }
}

export default new SubmissionScenario()
