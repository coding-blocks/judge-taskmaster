import {execRun} from '../src/tasks/run'
import {expect} from 'chai'

describe('run - golang', () => {
  it('.go file runs correctly', () => {
    execRun({
      id: 28,
      lang: 'golang',
      source: (new Buffer(`
        package main;

        import "fmt";

        func main() {
          var text string
          fmt.Scanf("%s", &text)
          fmt.Println("Hello " + text)
        }

      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World')
    })
  })
})
