import {execute} from '../../src/tasks/'
import {expect} from 'chai'
import { RunJob } from '../../src/tasks/job'

describe('run - cpp', () => {
  it('.cpp file runs correctly', async () => {
    const runResult = await execute(new RunJob({
      id: 20,
      lang: 'cpp',
      source: (new Buffer(`
#include <iostream>
using namespace std;
int main () {
    char in[10];
    cin>>in;
    cout<<"Hello "<<in;
    return 0;
}
      `)).toString('base64'),
      scenario: 'run',
      stdin: (new Buffer('World')).toString('base64')
    }))
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World')
  })
})
