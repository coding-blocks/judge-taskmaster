"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
const run_1 = require("./tasks/run");
const config = require("../config.js");
let jobQ = 'job_queue';
let successQ = 'success_queue';
// Connect to amqp://user:pass@host:port/
amqp.connect(`amqp://${config.AMQP.USER}:${config.AMQP.PASS}@${config.AMQP.HOST}:${config.AMQP.PORT}`, (err, connection) => {
    if (err)
        throw err;
    connection.createChannel((err2, channel) => {
        channel.assertQueue(successQ);
        channel.assertQueue(jobQ);
        channel.consume(jobQ, (msg) => {
            let job = JSON.parse(msg.content.toString());
            run_1.execRun(job, (jobResult) => {
                channel.sendToQueue(successQ, (new Buffer(JSON.stringify({
                    id: job.id,
                    stderr: jobResult.stderr,
                    stdout: jobResult.stdout
                }))));
                channel.ack(msg);
            });
        });
    });
});
//# sourceMappingURL=taskmaster.js.map