import * as path from 'node:path';
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';


export const up = currentPath => {
  return path.dirname(currentPath);
}

export const cd = (args, currentPath) => {
  if (args.length < 2) {
    return [new InvalidArgumentError('no path'), null];
  }

  let destination = args[1];

  if (destination === '..') {
    return [null, up(currentPath)];
  }

  if (destination.match(/^[\/]$/) !== null) {
    return [null, path.parse(currentPath).root];
  }


  if (!path.isAbsolute(destination)) {
    destination = path.join(currentPath, path.normalize(destination));
  }
  console.log('destination: ', destination);
  return [null, currentPath];
}