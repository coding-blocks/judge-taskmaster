import config = require('../../../config.js')
import { cat, ls, mkdir, exec, ShellString } from 'shelljs'
import { SubmitJob } from '../jobs/submission'
import { SubmissionResult } from 'types/result'
import * as path from 'path'
import * as fs from 'fs'
import { Scenario } from 'tasks/scenario'
import { download } from 'utils/request'

export default class SubmissionScenario extends Scenario {
  setup(currentJobDir: string, job: SubmitJob) {
    const LANG_CONFIG = config.LANGS[job.lang]

    fs.writeFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE),
      (new Buffer(job.source, 'base64')).toString('ascii'))
    const testCasesDir = path.join(currentJobDir, 'testcases')
    mkdir('-p', testCasesDir)

    return Promise.all(job.testcases.map(testcase => {
      const rootDir = path.join(testCasesDir, '' + testcase.id)
      mkdir('-p', rootDir)      
      if(testcase.timelimit) {
        ShellString(testcase.timelimit[job.lang]).to(path.join(rootDir + '/timelimit'))
      }
      if(testcase.memorylimit) {
        ShellString(testcase.memorylimit[job.lang]).to(path.join(rootDir + '/memorylimit'))
      }
      return download(testcase.input, path.join(rootDir, 'stdin'))
    }))
  }

  async result(currentJobDir: string, job: SubmitJob): Promise<SubmissionResult> {
    // Check for compile_stderr if can't find a stdout file ; stdout can be ''
    const compile_stderr = cat(path.join(currentJobDir, 'compile.stderr')).toString()

    if (compile_stderr) {
      return {
        id: job.id,
        scenario: 'submit',
        stderr: (new Buffer(compile_stderr)).toString('base64'),
        testcases: []
      }
    }

    await Promise.all(job.testcases.map(async testcase => {
      const rootDir = path.join(currentJobDir, 'testcases', '' + testcase.id)
      return download(testcase.output, path.join(rootDir, 'stdout'))
    }))

    const testcases = ls(path.join(currentJobDir, 'testcases')).map(testcase => {
      const currentTestcasePath = path.join(currentJobDir, 'testcases', testcase)

      const stderr = cat(path.join(currentTestcasePath, 'run.stderr')).toString()
      const time = cat(path.join(currentTestcasePath, 'runguard.time')).toString().trim()
      const code = cat(path.join(currentTestcasePath, 'runguard.code')).toString()
      const timelimit = cat(path.join(currentTestcasePath, 'timelimit'))

      const runOutputFile = path.join(currentTestcasePath, 'run.stdout')
      const expectedOutputFile = path.join(currentTestcasePath, 'stdout')

      let score = 0;
      switch(job.lang) {
        case 'mysql': {
          const fromEntries =  (entries) => {
            return entries.reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          };

          const normalizeObject = (obj) => 
            fromEntries(Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
          
          const compare = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
          
            const sortedArr1 = arr1.map(normalizeObject).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
            const sortedArr2 = arr2.map(normalizeObject).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
          
            return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
          };
          const runOutput = fs.readFileSync(runOutputFile, {
            encoding: 'utf-8'
          });
          const expectedOutput = fs.readFileSync(expectedOutputFile, {
            encoding: 'utf-8'
          });
          score = compare(JSON.parse(runOutput), JSON.parse(expectedOutput)) ? 100 : 0;
          break;
        }
        default: {
          const diff = exec(`
            diff -b -B -a --suppress-common-lines --speed-large-files ${runOutputFile} ${expectedOutputFile}
          `);
          score = diff.code === 0 ? 100 : 0;
          break;
        }
      }

      let result = new Array(
        +code === 143 && "TLE",
        +code === 139 && "MLE",
        +code !== 0 && "Run Error",
        +code === 0 && score === 0 && "Wrong Answer",
        +code === 0 && "Success"
      ).reduce((acc, cur) => acc || cur)
      if (stderr || result !== "Success")
        score = 0
      if(+timelimit.stdout && +time > +timelimit.stdout && +code !== 143) {
        result = "TLE"
        score = 0
      }
      return {
        id: +testcase,
        time,
        result,
        score,
        stderr
      }
    })

    return {
      id: job.id,
      scenario: 'submit',
      stderr: (new Buffer(compile_stderr)).toString('base64'),
      testcases
    }
  }
}
