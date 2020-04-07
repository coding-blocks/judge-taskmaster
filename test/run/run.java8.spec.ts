import {executor} from '../../src/tasks/'
import {expect} from 'chai'


describe('run - java8', () => {
  it('.java file runs correctly (Java8)', async () => {
    const runResult = await executor({
      id: 22,
      lang: 'java8',
      source: (new Buffer(`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String input = in.next();
        System.out.println("Hello " + input);
    }
}
      `)).toString('base64'),
      stdin: (new Buffer('World')).toString('base64')
    })
    expect(new Buffer(runResult.stdout, 'base64').toString('ascii')).to.eq('Hello World\n')
  })
})
