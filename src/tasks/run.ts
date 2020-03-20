import config = require('../../config.js')
import {cat, exec, mkdir, rm, touch} from 'shelljs'
import {RunJob, RunResult} from '../types/job'
import * as path from 'path'
import * as fs from 'fs'

rm('-rf', config.RUNBOX.DIR)
mkdir('-p', config.RUNBOX.DIR)

function execRun (job: RunJob, executed: (result: RunResult) => void) {
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
    runguard -t 5 bash -c "/bin/compile.sh && /bin/run.sh"
  `)

  let stdout = cat(path.join(currentJobDir, 'run.stdout'))

  // Check for compile_stderr if can't find a stdout file ; stdout can be ''
  let compile_stderr = stdout.stderr ? cat(path.join(currentJobDir, 'compile.stderr')) : ''
  let stderr = compile_stderr || cat((path.join(currentJobDir, 'run.stderr')).toString())

  executed({
    id: job.id,
    stderr: (new Buffer(stderr)).toString('base64'),
    stdout: (new Buffer(stdout)).toString('base64')
  })

  rm('-rf', currentJobDir)
}

export {
  execRun
}
