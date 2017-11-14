import config = require('../../config.js')
import {cat, exec, mkdir, rm, touch} from 'shelljs'
import {RunJob, RunResult} from '../types/job'
import * as path from 'path'
import * as fs from 'fs'

rm('-rf', config.RUNBOX.DIR)
mkdir('-p', config.RUNBOX.DIR)

function execRun (job: RunJob): RunResult {
  let currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString())
  mkdir('-p', currentJobDir)

  fs.writeFileSync(path.join(currentJobDir, 'source.c'), (new Buffer(job.source, 'base64')).toString('ascii'))
  fs.writeFileSync(path.join(currentJobDir, 'run.stdin'), (new Buffer(job.stdin, 'base64')).toString('ascii'))

  exec(`docker run \\
    --cpus="0.5" \\
    --memory="20m" \\
    --ulimit nofile=64:64 \\
    --rm \\
    --read-only \\
    -v "${currentJobDir}":/usr/src/runbox \\
    -w /usr/src/runbox \\
    codingblocks/judge-worker-c \\
    bash -c "/bin/compile.sh && /bin/run.sh"
  `)
  let stdout = cat(path.join(currentJobDir, 'run.stdout'))
  let stderr = cat(path.join(currentJobDir, 'run.stderr'))

  return {
    id: job.id,
    stderr: (new Buffer(stderr)).toString('base64'),
    stdout: (new Buffer(stdout)).toString('base64')
  }
}

export {
  execRun
}