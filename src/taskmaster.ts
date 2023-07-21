const nr = require('newrelic');
import * as Raven from 'raven'
import * as amqp from 'amqplib/callback_api'
import {Connection} from 'amqplib/callback_api'
import { execute } from './tasks'
import config = require('../config.js')
import {SubmitJob} from './tasks/jobs/submission';
import {ProjectJob} from './tasks/jobs/project';
import {RunJob} from './tasks/jobs/run';
import { mkdir } from 'shelljs'

// =============== Setup Raven
Raven.config(config.SENTRY.DSN, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true,
  development: true
}).install()
// =============== Setup Raven

const jobQ = config.JOB_QUEUE
const successQ = config.SUCCESS_QUEUE
const errorQ = config.ERROR_QUEUE

mkdir('-p', config.RUNBOX.DIR)

amqp.connect(`amqp://${config.AMQP.USER}:${config.AMQP.PASS}@${config.AMQP.HOST}:${config.AMQP.PORT}`, (err, connection: Connection) => {
  if (err) {
    Raven.captureException(err);
    throw err
  }

  connection.createChannel((err2, channel) => {
    if (err2) {
      Raven.captureException(err2);
      throw err2
    }

    channel.assertQueue(successQ);
    channel.assertQueue(jobQ);
    channel.assertQueue(errorQ);

    channel.prefetch(1);

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
          case 'project':
            job = new ProjectJob(payload)
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
