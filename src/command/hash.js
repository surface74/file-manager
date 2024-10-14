import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
import { createHash } from 'node:crypto';

import { InvalidArgumentError, OperationFailedError } from '../error.js';
import { getAbsolutePath } from '../utils/path-utils.js';

/**
 *
 * @param {string[]} param0
 */
export const hash = async ([fileName]) => {
  if (!fileName) {
    throw new InvalidArgumentError();
  }
  const fileToHash = getAbsolutePath(fileName);

  return new Promise((resolve, reject) => {
    const readStream = createReadStream(fileToHash);
    const hash = createHash('sha256');

    readStream.pipe(hash).setEncoding('hex').pipe(stdout);
    readStream.on('error', error => reject(new OperationFailedError(error.message)));
    readStream.on('end', () => {
      console.log();
      resolve(null);
    });
  });
}