import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';

import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';

export const cat = async (currentPath, [, fileName]) => {
  if (!fileName) {
    return [new InvalidArgumentError(), false];
  }

  let fullPath = path.normalize(fileName);

  if (!path.isAbsolute(fullPath)) {
    fullPath = path.join(currentPath, fullPath);
  }

  const readStream = createReadStream(fullPath);
  readStream.on('error', error => {
    return [new OperationFailedError(error.message), false];
  });
  // createReadStream(fullPath).pipe(stdout);
};
// https://www.youtube.com/shorts/ITogH7lJTyE