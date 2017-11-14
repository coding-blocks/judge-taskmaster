"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
const run_1 = require("./tasks/run");
let jobQ = 'job_queue';
let successQ = 'success_queue';
amqp.connect('amqp://localhost', (err, connection) => {
    if (err)
        throw err;
    connection.createChannel((err2, channel) => {
        channel.assertQueue(successQ);
        channel.assertQueue(jobQ);
        channel.consume(jobQ, (msg) => {
            let job = JSON.parse(msg.content.toString());
            let jobResult = run_1.execRun(job);
            channel.sendToQueue(successQ, (new Buffer(JSON.stringify({
                id: job.id,
                stderr: 'stderr',
                stdout: 'stdout'
            }))));
            channel.ack(msg);
        });
    });
});
//# sourceMappingURL=taskmaster.js.map