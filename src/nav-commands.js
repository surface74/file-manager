import * as path from 'node:path';
import { InvalidArgumentError, OperationFailedError } from './error.js';
import { readdir } from 'node:fs/promises';

import { Result } from './result.js'
import { getAbsolutePath } from './utils.js';

export const up = async (currentPath) => {
  return new Result(null, path.dirname(currentPath));
}

export const cd = async (currentPath, [destinationPath]) => {
  if (!destinationPath) {
    return new Result(new InvalidArgumentError(), currentPath);
  }

  let destination = destinationPath;

  if (destination.match(/^\.\.[\\/]?$/) !== null) {
    return new Result(null, path.dirname(currentPath));
  }

  if (destination.match(/^[\\/]$/) !== null) {
    return new Result(null, path.parse(currentPath).root);
  }

  if (destination.endsWith(':')) {
    destination = destination + path.sep;
  }

  const result = destination.match(/^\.[\\/]?/);
  if (result) {
    destination = destination.slice(result[0].length);
  }

  destination = getAbsolutePath(currentPath, destination);

  return await readdir(destination)
    .then(() => new Result(null, destination))
    .catch(err => new Result(new OperationFailedError(err.message), currentPath));
}

export const ls = async (currentPath) => {
  try {
    const entities = await readdir(currentPath, { withFileTypes: true });
    const dirs = [];
    const files = [];
    for (const entity of entities) {
      if (entity.isFile()) {
        files.push({ Name: entity.name, Type: 'file' });
      } else if (entity.isDirectory()) {
        dirs.push({ Name: entity.name, Type: 'directory' })
      }
    }
    dirs.sort((item1, item2) => item1.Name.localeCompare(item2.Name));
    files.sort((item1, item2) => item1.Name.localeCompare(item2.Name));
    console.table([...dirs, ...files]);
    return new Result(null, currentPath);
  } catch (error) {
    return new Result(new InvalidArgumentError(err.message), currentPath);
  }
}
