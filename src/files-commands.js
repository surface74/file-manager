import * as path from 'path';
import { createReadStream, createWriteStream } from 'node:fs';
import { stdout } from 'node:process';

import { color } from './colors.js';
import { InvalidArgumentError, OperationFailedError } from './error.js';


export const cat = (currentPath, [, fileName]) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      reject([new InvalidArgumentError(), false]);
    }

    const result = fileName.match(/^\.[\\/]?/);
    if (result) {
      fileName = fileName.slice(result[0].length);
    }

    let fullPath = path.normalize(fileName);

    if (!path.isAbsolute(fullPath)) {
      fullPath = path.join(currentPath, fullPath);
    }

    const readStream = createReadStream(fullPath);
    console.log('fullPath: ', fullPath);
    readStream.pipe(stdout);

    readStream.on('error', error => reject([new OperationFailedError(error.message), false]));

    readStream.on('end', () => {
      console.log();
      return resolve([null, true])
    });
  })
};

export const add = (currentPath, [, fileName]) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      reject([new InvalidArgumentError(), false]);
    }

    if (path.isAbsolute(fileName) || fileName.match(/[\\/]+/)) {
      reject([new InvalidArgumentError('a file can be created in current path only'), false]);
    }

    let fullPath = path.join(currentPath, path.normalize(fileName));

    const writeStream = createWriteStream(fullPath, { flags: 'ax' });

    writeStream.on('error', error => reject([new OperationFailedError(error.message), false]));

    writeStream.on('ready', () => {
      console.colorLog(color.green, `File created: ${writeStream.path}`);
      writeStream.close();
      return resolve([null, true])
    });
  })
};
