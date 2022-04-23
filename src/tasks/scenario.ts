import config = require('../../config');
import { exec } from 'shelljs';
import { Job } from "./job";
import { Result } from "types/result";

export class Scenario {
  setup(currentJobDir: string, job: Job) {
    throw new Error("Not Implemented")
  }
  run(currentJobDir: string, job: Job) {
    const LANG_CONFIG = config.LANGS[job.lang]
    return exec(`docker run \\
      --cpus="${LANG_CONFIG.CPU_SHARE}" \\
      --memory="${LANG_CONFIG.MEM_LIMIT}" \\
      --ulimit nofile=64:64 \\
      --rm \\
      -v "${currentJobDir}":/usr/src/runbox \\
      -w /usr/src/runbox \\
      codingblocks/judge-worker-${job.lang} \\
      /bin/judge.sh
    `)
  }
  result(currentJobDir: string, job: Job): Promise<Result> {
    throw new Error("Not Implemented")
  }
}