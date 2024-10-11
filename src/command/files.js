import * as path from 'node:path';
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';

import makeResult from '../utils/result.js';
import { InvalidArgumentError, OperationFailedError } from '../error.js';

export const cat = ([readFileName]) => {
  if (!readFileName) {
    return makeResult(new InvalidArgumentError(), false);
  }

  const fullPath = path.isAbsolute(readFileName) ? readFileName : path.resolve(readFileName);

  return new Promise((resolve) => {
    const readStream = createReadStream(fullPath);
    readStream.pipe(stdout);

    readStream.on('error', (error) => resolve(makeResult(new OperationFailedError(error.message), false)));

    readStream.on('end', () => {
      console.log();
      resolve(makeResult(null, true))
    });
  })
};

