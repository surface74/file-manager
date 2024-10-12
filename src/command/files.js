import * as path from 'node:path';
import { createReadStream, createWriteStream, constants, access, rename } from 'node:fs';
import { stdout } from 'node:process';

import { InvalidArgumentError, OperationFailedError } from '../error.js';
import Message from '../message.js';
import { getAbsolutePath } from '../utils/path-utils.js';
import { pipeline } from 'node:stream/promises';
import { writeFile } from 'node:fs/promises';

export const cat = ([readFileName]) => {
  if (!readFileName) {
    throw new InvalidArgumentError();
  }

  const fullPath = getAbsolutePath(readFileName);

  return new Promise((resolve, reject) => {
    const readStream = createReadStream(fullPath);

    readStream.pipe(stdout);
    readStream.on('error', error => reject(new OperationFailedError(error.message)));
    readStream.on('end', () => {
      console.log();
      resolve(null)
    });
  })
};

export const add = async ([fileName]) => {
  if (!fileName) {
    throw new InvalidArgumentError();
  }

  let fullPath = path.join(process.cwd(), fileName);
  // const writeStream = createWriteStream(fullPath, { flags: 'ax' });

  try {
    await writeFile(fullPath, '', { flag: 'wx' });
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
  // return new Promise((resolve, reject) => {
  //   const writeStream = createWriteStream(fullPath, { flags: 'ax' });

  //   writeStream.on('error', error => reject(new OperationFailedError(error.message)));
  //   writeStream.on('ready', () => {
  //     writeStream.close();
  //     resolve(true);
  //   });
  // })
};

export const rn = ([originName, resultName]) => {
  if (!originName || !resultName) {
    throw new InvalidArgumentError(Message.NEED_2_ARGS);
  }

  if (path.isAbsolute(resultName)) {
    throw new InvalidArgumentError(Message.SECOND_ARG_FILE_NAME);
  }

  let sourceFile = getAbsolutePath(originName);
  let destinationFile = path.join(path.dirname(sourceFile), resultName);

  return new Promise((resolve, reject) => {
    access(destinationFile, constants.F_OK, error => {
      if (!error) {
        reject(new InvalidArgumentError(Message.FILE_EXISTS.replace('%%FILE_EXISTS%%', destinationFile)));
      } else {
        rename(sourceFile, destinationFile, error => {
          if (error) {
            reject(new OperationFailedError(error.message));
          }
          resolve(null);
        });
      }
    });
  })
};

export const cp = async ([source, destination]) => {
  if (!source || !destination) {
    throw new InvalidArgumentError(Message.NEED_2_ARGS);
  }

  const sourceFile = getAbsolutePath(source);
  const destinationFile = path.join(getAbsolutePath(destination), path.basename(sourceFile));

  const readStream = createReadStream(sourceFile, { flags: 'r' });
  const writeStream = createWriteStream(destinationFile, { flags: 'wx' });

  try {
    await pipeline(readStream, writeStream);
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
}