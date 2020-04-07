import {executor} from '../../src/tasks/'
import {expect} from 'chai'


describe('run - py2', () => {
  it('.py file runs correctly (Python 2.7)', async () => {
    const runResult = await executor({
      id: 23,
      lang: 'py2',
      source: (new Buffer(`
inp = raw_input()
print("Hello " + inp)
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    })
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
  })
})
