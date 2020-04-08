import {runExecutor} from '../../src/tasks/'
import {expect} from 'chai'


describe('run - cpp', () => {
  it('.cpp file runs correctly', async () => {
    const runResult = await runExecutor({
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
      stdin: (new Buffer('World')).toString('base64')
    })
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World')
  })
})
