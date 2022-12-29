import * as path from 'node:path';
import { createReadStream, createWriteStream, constants, access, rename } from 'node:fs';
import { rm as fsRm } from 'node:fs/promises';
import { stdout } from 'node:process';

import { Result } from './result.js';
import { InvalidArgumentError, OperationFailedError } from './error.js';
import { getAbsolutePath, normalizePath } from './utils.js';

export const cat = (currentPath, [fileName]) => {
  if (!fileName) {
    return new Result(new InvalidArgumentError(), false);
  }
  const checkDotAhead = fileName.match(/^\.[\\/]?/);
  if (checkDotAhead) {
    fileName = fileName.slice(checkDotAhead[0].length);
  }

  let fullPath = getAbsolutePath(currentPath, path.normalize(fileName));

  return new Promise((resolve) => {
    const readStream = createReadStream(fullPath);
    readStream.pipe(stdout);

    readStream.on('error', (error) => resolve(new Result(new OperationFailedError(error.message), false)));

    readStream.on('end', () => {
      console.log();
      resolve(new Result(null, true))
    });
  })
};

export const add = (currentPath, [fileName]) => {
  if (!fileName) {
    return new Result(new InvalidArgumentError(), false);
  }

  if (path.isAbsolute(fileName) || fileName.match(/[\\/]+/)) {
    return new Result(new InvalidArgumentError('file can be created in current path only'), false);
  }

  let fullPath = getAbsolutePath(currentPath, fileName);

  return new Promise((resolve) => {
    const writeStream = createWriteStream(fullPath, { flags: 'ax' });

    writeStream.on('error', error => resolve(new Result(new OperationFailedError(error.message), false)));

    writeStream.on('ready', () => {
      writeStream.close();
      resolve(new Result(null, true))
    });
  })
};

export const rn = (currentPath, [originName, resultName]) => {
  if (!resultName) {
    return new Result(new InvalidArgumentError('must be passed 2 parameters'), false);
  }

  let sourceFile = getAbsolutePath(currentPath, originName);

  let destinationFile = path.normalize(resultName);
  if (destinationFile.match(/[\\/:]/)) {
    return new Result(new InvalidArgumentError('2nd parameter have to be the file name only'), false);
  }
  destinationFile = path.join(path.dirname(sourceFile), destinationFile);

  return new Promise((resolve) => {
    access(destinationFile, constants.F_OK, (err) => {
      if (!err) {
        resolve(new Result(new InvalidArgumentError(`file ${destinationFile} already exists`), false));
      } else {
        rename(sourceFile, destinationFile, (err) => {
          if (err) {
            resolve(new Result(new OperationFailedError(err.message), false));
          }
          resolve(new Result(null, true));
        });
      }
    });
  })
};

export const cp = (currentPath, [source, destination]) => {
  if (!destination) {
    return new Result(new InvalidArgumentError('must be passed 2 parameters'), false);
  }

  const sourceFile = getAbsolutePath(currentPath, source);
  const destinationPath = normalizePath(currentPath, destination);
  const destinationFile = path.join(destinationPath, path.basename(sourceFile));

  const readStream = createReadStream(sourceFile, { flags: 'r' });
  const writeStream = createWriteStream(destinationFile, { flags: 'wx' });

  return new Promise((resolve) => {
    readStream.pipe(writeStream);

    writeStream.on('finish', () => {
      resolve(new Result(null, true))
    });

    writeStream.on('error', error =>
      resolve(new Result(new OperationFailedError(error.message), false)));

    readStream.on('error', error =>
      resolve(new Result(new OperationFailedError(error.message), false)));
  })
}

export const mv = async (currentPath, [source, destination]) => {
  if (!destination) {
    return new Result(new InvalidArgumentError('must be passed 2 parameters'), false);
  }

  let sourceFile = getAbsolutePath(currentPath, source);

  let { error } = await cp(currentPath, [sourceFile, destination]);
  if (error) {
    return new Result(new OperationFailedError(error.message), false);
  }

  ({ error } = await rm(currentPath, [sourceFile]));
  if (error) {
    return new Result(error, false);
  }
  return new Result(null, true);
}

export const rm = async (currentPath, [source]) => {
  if (!source) {
    return new Result(new InvalidArgumentError(), false);
  }

  const fileToDelete = getAbsolutePath(currentPath, source);

  try {
    await fsRm(fileToDelete);
  } catch (error) {
    return new Result(new OperationFailedError(error.message), false);
  }
  return new Result(null, true);
}