import {execRun} from '../src/tasks/run'
import {expect} from 'chai'


describe('run - csharp', () => {
  it('.cs file runs correctly (c#)', () => {
    execRun({
      id: 28,
      lang: 'c#',
      source: (new Buffer(`
using System;
public class HelloWorld {
  static public void Main () {
    Console.WriteLine ("Hello " + Console.ReadLine());
  }
}      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
    })
  })
})