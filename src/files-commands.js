import * as path from 'path';
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';

import { InvalidArgumentError, OperationFailedError } from './error.js';


export const cat = (currentPath, [, fileName]) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      resolve ([new InvalidArgumentError(), false]);
    }
    let fullPath = path.normalize(fileName);

    if (!path.isAbsolute(fullPath)) {
      fullPath = path.join(currentPath, fullPath);
    }

    const readStream = createReadStream(fullPath);
    console.log('fullPath: ', fullPath);
    readStream.pipe(stdout);

    readStream.on('error', error => resolve([new OperationFailedError(error.message), false]));

    readStream.on('end', () => {
      console.log();
      return resolve([null, true])});
  })
};
