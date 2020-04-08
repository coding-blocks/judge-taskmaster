const nr = require('newrelic');
import * as Raven from 'raven'
import * as amqp from 'amqplib/callback_api'
import {Connection} from 'amqplib/callback_api'
import { runExecutor, submissionExecutor } from './tasks'
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
        const job = JSON.parse(msg.content.toString())
        let jobResult
        if (job.testcases) {
          jobResult = await submissionExecutor(job)
        } else {
          jobResult = await runExecutor(job)
        }
        
        // TODO
        channel.sendToQueue(successQ, (new Buffer(JSON.stringify(jobResult))))
        channel.ack(msg)
      } catch (err) {
        Raven.captureException(err);
      }
    })
  })
})
