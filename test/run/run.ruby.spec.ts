import {execute} from '../../src/tasks/'
import {expect} from 'chai'
import {RunJob} from '../../src/tasks/jobs/run'


describe('run - ruby', () => {
  it('.rb file runs correctly', async () => {
    const runResult = await execute(new RunJob({
      id: 27,
      lang: 'ruby',
      source: (new Buffer(`
puts "Hello " + gets.to_s
      `)).toString('base64'),
      scenario: 'run',
      stdin: (new Buffer('World')).toString('base64')
    }))
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
  })
})
