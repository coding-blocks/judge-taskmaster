import {executor} from '../../src/tasks/'
import {expect} from 'chai'


describe('run - nodejs10', () => {
  it('.js file runs correctly (NodeJS 6)', async () => {
    const runResult = await executor({
      id: 24,
      lang: 'nodejs10',
      source: (new Buffer(`
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
  console.log("Hello " + line);
});
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    })
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
  })
})
