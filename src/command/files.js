import * as path from 'node:path';
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';

import { InvalidArgumentError, OperationFailedError } from '../error.js';


export const cat = ([readFileName]) => {
  if (!readFileName) {
    throw new InvalidArgumentError();
  }

  const fullPath = path.isAbsolute(readFileName) ? readFileName : path.resolve(readFileName);

  return new Promise((resolve, reject) => {
    const readStream = createReadStream(fullPath);

    readStream.pipe(stdout);

    readStream.on('error', (error) => reject(new OperationFailedError(error.message)));

    readStream.on('end', () => {
      console.log();
      resolve(null)
    });
  })
};

