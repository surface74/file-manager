import * as path from 'node:path';
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';
import { readdirSync } from 'node:fs';

export const up = (args, currentPath) => {
  return [null, path.dirname(currentPath)];
}

export const cd = (args, currentPath) => {
  if (args.length < 2) {
    return [new InvalidArgumentError(), currentPath];
  }

  let destination = args[1];

  if (destination.match(/^\.\.[\\/]?$/) !== null) {
    return [null, path.dirname(currentPath)];
  }

  if (destination.match(/^[\\/]$/) !== null) {
    return [null, path.parse(currentPath).root];
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
    return [null, destination];
  } catch (error) {
    return [new InvalidArgumentError(error.message), currentPath];
  }
}

export const ls = (args, currentPath) => {
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
    console.table([...dirs, ...files], ['Name', 'Type']);
    return [null, currentPath];
  } catch (error) {
    return [new InvalidArgumentError(error.message), currentPath];
  }
}
