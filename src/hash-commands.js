import * as path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { stdout } from 'node:process';
import { createHash } from 'node:crypto';

import { Result } from './result.js';
import { InvalidArgumentError, OperationFailedError } from './error.js';

export const hash = (currentPath, [, fileName]) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      reject(new Result(new InvalidArgumentError(), false));
    }

    let fileToHash = path.normalize(fileName);
    if (!path.isAbsolute(fileToHash)) {
      fileToHash = path.join(currentPath, fileToHash);
    }

    const readStream = createReadStream(fileToHash);
    const hash = createHash('sha256');

    readStream.pipe(hash).setEncoding('hex').pipe(stdout);

    readStream.on('error', error =>
      reject(new Result(new OperationFailedError(error.message), false)));

    readStream.on('end', () => {
      console.log();
      resolve(new Result(null, true))
    });
  })
}