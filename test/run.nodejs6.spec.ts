import {execRun} from '../src/tasks/run'
import {expect} from 'chai'


describe('run - nodejs6', () => {
  it('.js file runs correctly (NodeJS 6)', () => {
    execRun({
      id: 24,
      lang: 'nodejs6',
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
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
    })
  })
})