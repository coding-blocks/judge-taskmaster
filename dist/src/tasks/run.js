"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../../config.js");
const shelljs_1 = require("shelljs");
const path = require("path");
const fs = require("fs");
shelljs_1.rm('-rf', config.RUNBOX.DIR);
shelljs_1.mkdir('-p', config.RUNBOX.DIR);
function execRun(job) {
    let currentJobDir = path.join(config.RUNBOX.DIR, job.id.toString());
    shelljs_1.mkdir('-p', currentJobDir);
    fs.writeFileSync(path.join(currentJobDir, 'source.c'), (new Buffer(job.source, 'base64')).toString('ascii'));
    fs.writeFileSync(path.join(currentJobDir, 'run.stdin'), (new Buffer(job.stdin, 'base64')).toString('ascii'));
    shelljs_1.exec(`docker run \\
    --cpus="0.5" \\
    --memory="20m" \\
    --ulimit nofile=64:64 \\
    --rm \\
    --read-only \\
    -v "${currentJobDir}":/usr/src/runbox \\
    -w /usr/src/runbox \\
    codingblocks/judge-worker-c \\
    bash -c "/bin/compile.sh && /bin/run.sh"
  `);
    let stdout = shelljs_1.cat(path.join(currentJobDir, 'run.stdout'));
    let stderr = shelljs_1.cat(path.join(currentJobDir, 'run.stderr'));
    return {
        id: job.id,
        stderr: (new Buffer(stderr)).toString('base64'),
        stdout: (new Buffer(stdout)).toString('base64')
    };
}
exports.execRun = execRun;
//# sourceMappingURL=run.js.map