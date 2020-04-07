import { expect } from 'chai'
import { download } from '../src/tasks/submission'
import * as fs from 'fs'

describe('Submission Scenario', () => {
  it('should download', async () => {
    const url = 'https://minio.cb.lk/public/input'
    const result = await download(url, '/tmp/input')

    // assertion
    const content = fs.readFileSync('/tmp/input').toString()
    expect(content.trim()).to.eq('World')
  })
})