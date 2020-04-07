import config = require('../../config.js')
import {cat, exec, mkdir, rm, touch, head} from 'shelljs'
import {RunJob, RunResult} from '../types/job'
import * as path from 'path'
import * as fs from 'fs'

rm('-rf', config.RUNBOX.DIR)
mkdir('-p', config.RUNBOX.DIR)

async function execRun (job: RunJob): Promise<RunResult> {
  let currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
  mkdir('-p', currentJobDir)
  const LANG_CONFIG = config.LANGS[job.lang]

  fs.writeFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE),
    (new Buffer(job.source, 'base64')).toString('ascii'))
  fs.writeFileSync(path.join(currentJobDir, 'run.stdin'),
    (new Buffer(job.stdin, 'base64')).toString('ascii'))    

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
  let stderr = compile_stderr || cat((path.join(currentJobDir, 'run.stderr')).toString())

  const run_time = cat(path.join(currentJobDir, 'runguard.time')).toString()
  const code = cat(path.join(currentJobDir, 'runguard.code')).toString()

  rm('-rf', currentJobDir) 

  return {
    id: job.id,
    stderr: (new Buffer(stderr)).toString('base64'),
    stdout: (new Buffer(stdout)).toString('base64'),
    time: +run_time,
    code: +code
  }
}

export {
  execRun
}
