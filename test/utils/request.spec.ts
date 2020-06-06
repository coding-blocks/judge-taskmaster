import { expect } from 'chai';
import * as fs from 'fs';
import { download } from '../../src/utils/request';

describe('Request Utils', () => {
  it('should download', async () => {
    const url = 'https://minio.cb.lk/public/input'
    const result = await download(url, '/tmp/input')

    // assertion
    const content = fs.readFileSync('/tmp/input').toString()
    expect(content.trim()).to.eq('World')
  })
})
