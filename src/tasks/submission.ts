import config = require('../../config.js')
import { cat, exec, mkdir, rm } from 'shelljs'
import { SubmissionJob, SubmissionResult } from '../types/job'
import * as path from 'path'
import * as fs from 'fs'
import http = require('http')

rm('-rf', config.RUNBOX.DIR)
mkdir('-p', config.RUNBOX.DIR)

async function execSubmission(job: SubmissionJob): Promise<SubmissionResult> {
  let currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
  mkdir('-p', currentJobDir)
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
  const request = http.get(job.testcases, function (response) {
    response.pipe(file);
  });



  fs.writeFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE),
    (new Buffer(job.source, 'base64')).toString('ascii'))
  fs.writeFileSync(path.join(currentJobDir, ),
    (new Buffer(job.testcases)))

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

  const stdout = exec(`
    head -c 65536 ${path.join(currentJobDir, 'run.stdout')}
  `)



  // Check for compile_stderr if can't find a stdout file ; stdout can be ''
  const compile_stderr = cat(path.join(currentJobDir, 'compile.stderr')).toString()
  const runguard_stderr = cat(path.join(currentJobDir, 'runguard.stderr')).toString()
  let stderr = runguard_stderr || compile_stderr || cat((path.join(currentJobDir, 'run.stderr')).toString())

  rm('-rf', currentJobDir)

}

return {

}

export {
  execSubmission
}
