import * as path from 'node:path';
import { createReadStream, createWriteStream, constants, access, rename } from 'node:fs';
import { stdout } from 'node:process';

import { InvalidArgumentError, OperationFailedError } from '../error.js';
import Message from '../message.js';

export const cat = ([readFileName]) => {
  if (!readFileName) {
    throw new InvalidArgumentError();
  }

  const fullPath = path.isAbsolute(readFileName) ? readFileName : path.resolve(readFileName);

  return new Promise((resolve, reject) => {
    const readStream = createReadStream(fullPath);

    readStream.pipe(stdout);
    readStream.on('error', (error) => reject(new OperationFailedError(error.message)));
    readStream.on('end', () => {
      console.log();
      resolve(null)
    });
  })
};

export const add = ([fileName]) => {
  if (!fileName) {
    throw new InvalidArgumentError();
  }

  let fullPath = path.join(process.cwd(), fileName);

  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(fullPath, { flags: 'ax' });

    writeStream.on('error', (error) => reject(new OperationFailedError(error.message)));
    writeStream.on('ready', () => {
      writeStream.close();
      resolve(true);
    });
  })
};

export const rn = ([originName, resultName]) => {
  if (!originName || !resultName) {
    throw new InvalidArgumentError(Message.NEED_2_ARGS);
  }

  if (path.isAbsolute(resultName)) {
    throw new InvalidArgumentError(Message.SECOND_ARG_FILE_NAME);
  }

  let sourceFile = path.isAbsolute(originName) ? originName : path.resolve(originName);
  let destinationFile = path.join(path.dirname(sourceFile), resultName);

  return new Promise((resolve, reject) => {
    access(destinationFile, constants.F_OK, (error) => {
      if (!error) {
        reject(new InvalidArgumentError(Message.FILE_EXISTS.replace('%%FILE_EXISTS%%', destinationFile)));
      } else {
        rename(sourceFile, destinationFile, (error) => {
          if (error) {
            reject(new OperationFailedError(error.message));
          }
          resolve(null);
        });
      }
    });
  })
};

