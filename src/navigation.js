import { dirname } from 'node:path';
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';


export const up = (args, currentPath) => {
  return dirname(currentPath);
}

export const cd = (args, currentPath) => {
  if (args.length < 2) {
    throw new InvalidArgumentError('no path');
  }

  const destination = args[1];

  if (destination === '..') {
    return up(args, currentPath);
  }

  if (path.isAbsolute()) {

  } else {

  }
}