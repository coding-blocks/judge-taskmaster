import {execute} from '../../src/tasks/'
import {expect} from 'chai'
import {RunJob} from '../../src/tasks/jobs/run'

describe('run - c', () => {
  it('.c file runs correctly', async () => {
    const runResult = await execute(new RunJob({
      id: Math.floor(Math.random() * 1000),
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
      scenario: 'run',
      stdin: (new Buffer('World')).toString('base64')
    }))
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World')
  })
})
