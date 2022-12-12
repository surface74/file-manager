import * as path from 'node:path';
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';


export const up = currentPath => {
  return path.dirname(currentPath);
}

export const cd = (args, currentPath) => {
  if (args.length < 2) {
    throw new InvalidArgumentError('no path');
  }

  let destination = args[1];

  if (destination === '..') {
    return up(currentPath);
  }

  if (destination.match(/^[\/]$/) !== null) {
    return path.parse(currentPath).root;
  }


  if (!path.isAbsolute(destination)) {
    destination = path.join(currentPath, path.normalize(destination)));
  }
  console.log('destination: ', destination);
  return currentPath;
}