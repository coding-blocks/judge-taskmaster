import axios from 'axios';
import * as fs from 'fs';

export const download = async (url: string, dest: string) => {
  const writer = fs.createWriteStream(dest);

  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  })

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('error', err => {
      console.log(err)
      writer.close();
      reject(err);
    })
    writer.on('close', () => {
      resolve();
    })
  })
}

