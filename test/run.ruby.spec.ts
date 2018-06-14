import {execRun} from '../src/tasks/run'
import {expect} from 'chai'


describe('run - ruby', () => {
  it('.rb file runs correctly (Ruby 2.4.4)', () => {
    execRun({
      id: 27,
      lang: 'ruby',
      source: (new Buffer(`
inp = gets.chomp
puts "Hello  #{inp}"
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
    })
  })
})