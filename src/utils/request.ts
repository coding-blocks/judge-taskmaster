import { ClientRequest } from 'http';
import * as https from 'https';
import * as fs from 'fs'

export const download = (url: string, dest: string): Promise<ClientRequest> => {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) =>
    https.get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        resolve()
      });
    }).on('error', err => {
      reject(err)
    })
  )
}
