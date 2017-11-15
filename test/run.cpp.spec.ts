import {execRun} from '../src/tasks/run'
import {expect} from 'chai'


describe('run', () => {
  it('.cpp file runs correctly', () => {
    execRun({
      id: 21,
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
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World')
    })
  })
})