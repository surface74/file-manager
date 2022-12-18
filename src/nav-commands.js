import * as path from 'node:path';
import { InvalidArgumentError } from './error.js';
import { readdirSync } from 'node:fs';

import { Result } from './result.js'

export const up = (currentPath) => {
  return new Result(null, path.dirname(currentPath));
}

export const cd = (currentPath, [destinationPath]) => {
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

  if (!path.isAbsolute(destination)) {
    destination = path.join(currentPath, path.normalize(destination));
  }

  try {
    readdirSync(destination);
    return new Result(null, destination);
  } catch (error) {
    return new Result(new InvalidArgumentError(error.message), currentPath);
  }
}

export const ls = (currentPath) => {
  try {
    const entities = readdirSync(currentPath, { withFileTypes: true });
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
    return new Result(new InvalidArgumentError(error.message), currentPath);
  }
}
