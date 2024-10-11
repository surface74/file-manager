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

export const ls = async () => {
  try {
    const dirs = [];
    const files = [];
    const entities = await readdir(process.cwd(), { withFileTypes: true });
    for (const entity of entities) {
      if (entity.isFile()) {
        files.push({ Name: entity.name, Type: 'file' });
      } else if (entity.isDirectory()) {
        dirs.push({ Name: entity.name, Type: 'directory' })
      }
    }
    dirs.sort((item1, item2) => item1.Name.localeCompare(item2.Name));
    files.sort((item1, item2) => item1.Name.localeCompare(item2.Name));

    if (dirs.length + files.length)
      console.table([...dirs, ...files]);

    return makeResult(null, process.cwd());
  } catch (error) {
    return makeResult(new OperationFailedError(error.message), null);
  }
}
