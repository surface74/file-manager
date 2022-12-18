import * as path from 'node:path';
import { createReadStream, createWriteStream, constants, rm as rmFs, rename, access } from 'node:fs';
import { stdout } from 'node:process';

import { Result } from './result.js';
import { InvalidArgumentError, OperationFailedError } from './error.js';


export const cat = (currentPath, [, fileName]) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      reject(new Result(new InvalidArgumentError(), false));
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
    readStream.pipe(stdout);

    readStream.on('error', error => reject(new Result(new OperationFailedError(error.message), false)));

    readStream.on('end', () => {
      console.log();
      resolve(new Result(null, true))
    });
  })
};

export const add = (currentPath, [, fileName]) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      reject(new Result(new InvalidArgumentError(), false));
    }

    if (path.isAbsolute(fileName) || fileName.match(/[\\/]+/)) {
      reject(new Result(new InvalidArgumentError('a file can be created in current path only'), false));
    }

    let fullPath = path.join(currentPath, path.normalize(fileName));

    const writeStream = createWriteStream(fullPath, { flags: 'ax' });

    writeStream.on('error', error => reject(new Result(new OperationFailedError(error.message), false)));

    writeStream.on('ready', () => {
      writeStream.close();
      resolve(new Result(null, true))
    });
  })
};

export const rn = (currentPath, args) => {
  return new Promise((resolve, reject) => {
    if (args.length < 3) {
      reject(new Result(new InvalidArgumentError('must be at least 2 parameters'), false));
    }

    let sourceFile = path.normalize(args[1]);
    if (!path.isAbsolute(sourceFile)) {
      sourceFile = path.join(currentPath, sourceFile);
    }

    let destinationFile = path.normalize(args[2]);
    if (destinationFile.match(/[\\/:]/)) {
      reject(new Result(new InvalidArgumentError('2nd parameter have to be the file name only'), false));
    }
    destinationFile = path.join(path.dirname(sourceFile), destinationFile);

    access(destinationFile, constants.F_OK, (err) => {
      if (!err) {
        reject(new Result(new InvalidArgumentError(`file ${destinationFile} already exists`), false));
      } else {
        rename(sourceFile, destinationFile, (err) => {
          if (err) {
            reject(new Result(new OperationFailedError(err.message), false));
          }
          resolve(new Result(null, true));
        });
      }
    });
  })
};

export const cp = (currentPath, args) => {
  return new Promise((resolve, reject) => {
    if (args.length < 3) {
      reject(new Result(new InvalidArgumentError('must be at least 2 parameters'), false));
    }

    let sourceFile = path.normalize(args[1]);
    if (!path.isAbsolute(sourceFile)) {
      sourceFile = path.join(currentPath, sourceFile);
    }

    let destinationFile = path.normalize(args[2]);
    if (!path.isAbsolute(destinationFile)) {
      destinationFile = path.join(currentPath, destinationFile);
    }
    const readStream = new createReadStream(sourceFile, { flags: 'r' });
    const writeStream = new createWriteStream(destinationFile, { flags: 'wx' });

    readStream.pipe(writeStream);

    writeStream.on('error', error =>
      reject(new Result(new OperationFailedError(error.message), false)));

    writeStream.on('finish', () => {
      resolve(new Result(null, true))
    });

    readStream.on('error', error =>
      reject(new Result(new OperationFailedError(error.message), false)));
  })
}

export const mv = async (currentPath, args) => {
  if (args.length < 3) {
    Promise.reject(new Result(new InvalidArgumentError('must be at least 2 parameters'), false));
  }

  let sourceFile = path.normalize(args[1]);
  if (!path.isAbsolute(sourceFile)) {
    sourceFile = path.join(currentPath, sourceFile);
  }

  let destinationFile = path.join(args[2], path.basename(sourceFile));

  const result = await cp(currentPath, [null, sourceFile, destinationFile])
    .then(result => result)
    .catch(result => result);

  if (!result.error) {
    await rm(currentPath, [null, sourceFile])
      .then(result => { resolve(result); })
      .catch(result => { reject(result); })
  } else {
    return Promise.reject(new Result(new OperationFailedError(result.error.message), false));
  }
}

export const rm = (currentPath, args) => {
  return new Promise((resolve, reject) => {
    if (args.length < 2) {
      reject(new Result(new InvalidArgumentError('must be at least 1 parameter'), false));
    }

    let fileToDelete = path.normalize(args[1]);
    if (!path.isAbsolute(fileToDelete)) {
      fileToDelete = path.join(currentPath, fileToDelete);
    }

    rmFs(fileToDelete, err => {
      if (err) {
        reject(new Result(new InvalidArgumentError(err.message), false));
      }
      resolve(new Result(null, true))
    })
  })
}