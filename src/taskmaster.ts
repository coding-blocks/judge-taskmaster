import * as amqp from 'amqplib/callback_api'
import {Connection} from 'amqplib/callback_api'
import {RunJob, RunResult} from './types/job'
import {execRun} from './tasks/run'
import config = require('../config.js')

let jobQ = 'job_queue'
let successQ = 'success_queue'

// Connect to amqp://user:pass@host:port/
amqp.connect(`amqp://${config.AMQP.USER}:${config.AMQP.PASS}@${config.AMQP.HOST}:${config.AMQP.PORT}`, (err, connection: Connection) => {
  if (err) throw err

  connection.createChannel((err2, channel) => {

    channel.assertQueue(successQ);
    channel.assertQueue(jobQ);
    channel.consume(jobQ, (msg) => {
      let job: RunJob = JSON.parse(msg.content.toString())
      execRun(job, (jobResult: RunResult) => {
        channel.sendToQueue(successQ, (new Buffer(JSON.stringify(<RunResult>{
          id: job.id,
          stderr: jobResult.stderr,
          stdout: jobResult.stdout,
          time: jobResult.time,
          code: jobResult.code
        }))))
        channel.ack(msg)
      });

    })


  })
})