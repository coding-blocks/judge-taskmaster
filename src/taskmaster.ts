const nr = require('newrelic');
import * as Raven from 'raven'
import * as amqp from 'amqplib/callback_api'
import {Connection} from 'amqplib/callback_api'
import {RunJob, RunResult} from './types/job'
import {execRun} from './tasks/run'
import config = require('../config.js')

// =============== Setup Raven
Raven.config(config.SENTRY.DSN, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true,
  development: true
}).install()
// =============== Setup Raven

let jobQ = 'job_queue'
let successQ = 'success_queue'

amqp.connect(`amqp://${config.AMQP.USER}:${config.AMQP.PASS}@${config.AMQP.HOST}:${config.AMQP.PORT}`, (err, connection: Connection) => {
  if (err) throw err

  connection.createChannel((err2, channel) => {

    channel.assertQueue(successQ);
    channel.assertQueue(jobQ);
    channel.consume(jobQ, async (msg) => {
      try {
        const job: RunJob = JSON.parse(msg.content.toString())
        const jobResult: RunResult = await execRun(job)
        
        channel.sendToQueue(successQ, (new Buffer(JSON.stringify(<RunResult>{
          id: job.id,
          stderr: jobResult.stderr,
          stdout: jobResult.stdout,
          time: jobResult.time,
          code: jobResult.code
        }))))
        channel.ack(msg)
      } catch (err) {
        Raven.captureException(err);
      }
    })


  })
})
