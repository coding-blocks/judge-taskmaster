"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../config.js");
const shelljs_1 = require("shelljs");
const path = require("path");
const fs = require("fs");
shelljs_1.rm('-rf', config.RUNBOX.DIR);
shelljs_1.mkdir('-p', config.RUNBOX.DIR);
function execRun(job, executed) {
    let currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString());
    shelljs_1.mkdir('-p', currentJobDir);
    const LANG_CONFIG = config.LANGS[job.lang];
    fs.writeFileSync(path.join(currentJobDir, LANG_CONFIG.SOURCE_FILE), (new Buffer(job.source, 'base64')).toString('ascii'));
    fs.writeFileSync(path.join(currentJobDir, 'run.stdin'), (new Buffer(job.stdin, 'base64')).toString('ascii'));
    shelljs_1.exec(`docker run \\
    --cpus="${LANG_CONFIG.CPU_SHARE}" \\
    --memory="${LANG_CONFIG.MEM_LIMIT}" \\
    --ulimit nofile=64:64 \\
    --rm \\
    --read-only \\
    -v "${currentJobDir}":/usr/src/runbox \\
    -w /usr/src/runbox \\
    codingblocks/judge-worker-${job.lang} \\
    bash -c "/bin/compile.sh && /bin/run.sh"
  `);
    let compile_stderr = shelljs_1.cat(path.join(currentJobDir, 'compile.stderr'));
    let stdout = shelljs_1.cat(path.join(currentJobDir, 'run.stdout'));
    let stderr = compile_stderr || (path.join(currentJobDir, 'run.stderr'));
    executed({
        id: job.id,
        stderr: (new Buffer(stderr)).toString('base64'),
        stdout: (new Buffer(stdout)).toString('base64')
    });
    shelljs_1.rm('-rf', currentJobDir);
}
exports.execRun = execRun;
//# sourceMappingURL=run.js.map