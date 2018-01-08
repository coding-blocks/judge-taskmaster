import {execRun} from '../src/tasks/run'
import {expect} from 'chai'


describe('run - c', () => {
  it('.c file runs correctly', () => {
    execRun({
      id: 20,
      lang: 'c',
      source: (new Buffer(`
#include <stdio.h>

int main () {
    char in[10];
    scanf("%s", in);
    printf("Hello %s", in);
    return 0;
}
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World')
    })
  })
})