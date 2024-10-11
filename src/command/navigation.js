import * as path from 'node:path';
import { readdir } from 'node:fs/promises';

import { OperationFailedError } from '../error.js';
import makeResult from '../utils/result.js';

export const up = async () => {
  try {
    process.chdir(path.dirname(process.cwd()));

    return makeResult(null, process.cwd());
  } catch (error) {
    return makeResult(new OperationFailedError(error.message), null);
  }
}

export const cd = async ([destination]) => {
  try {
    process.chdir(path.resolve(destination));

    return makeResult(null, process.cwd());
  } catch (error) {
    return makeResult(new OperationFailedError(error.message), null);
  }
}

