import {execute} from '../../src/tasks/'
import {expect} from 'chai'
import { RunJob } from '../../src/tasks/job'

describe('run - csharp', () => {
  it('.cs file runs correctly', async () => {
    const runResult = await execute(new RunJob({
      id: 21,
      lang: 'csharp',
      source: (new Buffer(`
using System;
public class HelloWorld {
    static public void Main () {
        Console.WriteLine ("Hello " + Console.ReadLine());
    }
}
      `)).toString('base64'),
      scenario: 'run',
      stdin: (new Buffer('World')).toString('base64')
    }))
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
  })
})
