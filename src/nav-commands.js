import * as path from 'node:path';
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';
import { readdirSync } from 'node:fs';


export const up = currentPath => {
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

  if (!path.isAbsolute(destination)) {
    destination = path.join(currentPath, path.normalize(destination));
  }

  try {
    readdirSync(destination, { withFileTypes: true });
    return [null, destination];
  } catch (error) {
    return [new InvalidArgumentError(error.message), currentPath];
  }
}