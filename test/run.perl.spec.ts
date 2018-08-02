import {execRun} from '../src/tasks/run'
import {expect} from 'chai'


describe('run - perl', () => {
  it('.pl file runs correctly', () => {
    execRun({
      id: 28,
      lang: 'perl',
      source: (new Buffer(`
        $input = <STDIN>;
        print "Hello '$input'";
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
    })
  })
})
