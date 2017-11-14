import * as amqp from 'amqplib/callback_api'
import {Connection} from 'amqplib/callback_api'
import {RunJob, RunResult} from './types/job'
import {execRun} from './tasks/run'

let jobQ = 'job_queue'
let successQ = 'success_queue'

amqp.connect('amqp://localhost', (err, connection: Connection) => {
  if (err) throw err

  connection.createChannel((err2, channel) => {

    channel.assertQueue(successQ);
    channel.assertQueue(jobQ);
    channel.consume(jobQ, (msg) => {
      let job: RunJob = JSON.parse(msg.content.toString())
      let jobResult: RunResult = execRun(job);

      channel.sendToQueue(successQ, (new Buffer(JSON.stringify(<RunResult>{
        id: job.id,
        stderr: 'stderr',
        stdout: 'stdout'
      }))))
      channel.ack(msg)
    })


  })
})