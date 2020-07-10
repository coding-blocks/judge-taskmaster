import {execute} from '../../src/tasks/'
import {expect} from 'chai'
import {RunJob} from '../../src/tasks/jobs/run'


describe('run - py3', () => {
  it('.py file runs correctly (Python 3.0)', async () => {
    const runResult = await execute(new RunJob({
      id: Math.floor(Math.random() * 1000),
      lang: 'py3',
      source: (new Buffer(`
inp = input()
print("Hello " + inp)
      `)).toString('base64'),
      scenario: 'run',
      stdin: (new Buffer('World')).toString('base64')
    }))
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
  })
})
