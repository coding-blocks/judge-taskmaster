import axios from 'axios';
import * as fs from 'fs';

export const download = (url: string, dest: string) => {
  const writer = fs.createWriteStream(dest);

  return axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  }).then(function (response) {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  });
}

