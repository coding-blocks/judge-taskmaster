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

const jobQ = 'job_queue'
const successQ = 'success_queue'
const errorQ = 'error_queue'

mkdir('-p', config.RUNBOX.DIR)

amqp.connect(`amqp://${config.AMQP.USER}:${config.AMQP.PASS}@${config.AMQP.HOST}:${config.AMQP.PORT}`, (err, connection: Connection) => {
  if (err) throw err

  connection.createChannel((err2, channel) => {

    channel.assertQueue(successQ);
    channel.assertQueue(jobQ);
    channel.assertQueue(errorQ);
    channel.consume(jobQ, async (msg) => {
      try {
        const payload = JSON.parse(msg.content.toString())      

        let job
        switch (payload.scenario) {
          case 'submit':
            job = new SubmitJob(payload)
            break
          case 'run':
            job = new RunJob(payload)
            break
          default:
            throw new Error("Scenario not declared")
        }
                
        const jobResult = await execute(job)
      
        channel.sendToQueue(successQ, (new Buffer(JSON.stringify(jobResult))))  
      } catch (err) {
        Raven.captureException(err);
        channel.sendToQueue(errorQ, (new Buffer(msg.content)))
      }
      channel.ack(msg)
    })
  })
})
