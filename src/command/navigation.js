import * as path from 'node:path';
import { readdir } from 'node:fs/promises';

import { OperationFailedError } from '../error.js';

export const up = () => {
  try {
    process.chdir(path.dirname(process.cwd()));
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
}

export const cd = ([destination]) => {
  try {
    process.chdir(path.resolve(destination));
  } catch (error) {
    throw new OperationFailedError(error.message);
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
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
}
