const nr = require('newrelic');
import * as Raven from 'raven'
import * as amqp from 'amqplib/callback_api'
import {Connection} from 'amqplib/callback_api'
import { execute } from './tasks'
import config = require('../config.js')
import { SubmitJob, RunJob } from 'tasks/job';
import { mkdir } from 'shelljs'

// =============== Setup Raven
Raven.config(config.SENTRY.DSN, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true,
  development: true
}).install()
// =============== Setup Raven

let jobQ = 'job_queue'
let successQ = 'success_queue'

mkdir('-p', config.RUNBOX.DIR)

amqp.connect(`amqp://${config.AMQP.USER}:${config.AMQP.PASS}@${config.AMQP.HOST}:${config.AMQP.PORT}`, (err, connection: Connection) => {
  if (err) throw err

  connection.createChannel((err2, channel) => {

    channel.assertQueue(successQ);
    channel.assertQueue(jobQ);
    channel.consume(jobQ, async (msg) => {
      try {
        const payload = JSON.parse(msg.content.toString())      

        let job
        if (payload.testcases) {
          job = new SubmitJob(payload)
        } else {
          job = new RunJob(payload)
        }
                
        const jobResult = await execute(job)
      
        // TODO
        channel.sendToQueue(successQ, (new Buffer(JSON.stringify(jobResult))))
        
      } catch (err) {
        Raven.captureException(err);
      }
      channel.ack(msg)
    })
  })
})
