import {executor} from '../../src/tasks/'
import {expect} from 'chai'


describe('run - py3', () => {
  it('.py file runs correctly (Python 3.0)', async () => {
    const runResult = await executor({
      id: 26,
      lang: 'py3',
      source: (new Buffer(`
inp = input()
print("Hello " + inp)
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    })
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
  })
})
