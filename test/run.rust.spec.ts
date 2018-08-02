import {execRun} from '../src/tasks/run'
import {expect} from 'chai'


describe('run - rust', () => {
  it('.rs file runs correctly', () => {
    execRun({
      id: 27,
      lang: 'rust',
      source: (new Buffer(`
        use std::io;
         fn main() {
            let mut input = String::new();
             io::stdin().read_line(&mut input)
                .ok()
                .expect("Couldn't read line");
             println!("Hello {}", input);
        }
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    }, (runResult) => {
      expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
    })
  })
})
