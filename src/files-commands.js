import * as path from 'node:path';
import { createReadStream, createWriteStream, constants, rm as fsRm, rename, access } from 'node:fs';
import { stdout } from 'node:process';

import { Result } from './result.js';
import { InvalidArgumentError, OperationFailedError } from './error.js';


export const cat = (currentPath, [fileName]) => {
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

export const add = (currentPath, [fileName]) => {
  return new Promise((resolve, reject) => {
    if (!fileName) {
      reject(new Result(new InvalidArgumentError(), false));
    }

    if (path.isAbsolute(fileName) || fileName.match(/[\\/]+/)) {
      reject(new Result(new InvalidArgumentError('file can be created in current path only'), false));
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

export const rn = (currentPath, [originName, resultName]) => {
  return new Promise((resolve, reject) => {
    if (!resultName) {
      reject(new Result(new InvalidArgumentError('must be passed 2 parameters'), false));
    }

    let sourceFile = path.normalize(originName);
    if (!path.isAbsolute(sourceFile)) {
      sourceFile = path.join(currentPath, sourceFile);
    }

    let destinationFile = path.normalize(resultName);
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

export const cp = (currentPath, [source, destination]) => {
  return new Promise((resolve, reject) => {
    if (!destination) {
      reject(new Result(new InvalidArgumentError('must be passed 2 parameters'), false));
    }

    let sourceFile = path.normalize(source);
    if (!path.isAbsolute(sourceFile)) {
      sourceFile = path.join(currentPath, sourceFile);
    }

    let destinationFile = path.normalize(destination);
    if (!path.isAbsolute(destinationFile)) {
      destinationFile = path.join(currentPath, destinationFile);
    }
    const readStream = createReadStream(sourceFile, { flags: 'r' });
    const writeStream = createWriteStream(destinationFile, { flags: 'wx' });

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

export const mv = async (currentPath, [source, destination]) => {
  if (!destination) {
    Promise.reject(new Result(new InvalidArgumentError('must be passed 2 parameters'), false));
  }

  let sourceFile = path.normalize(source);
  if (!path.isAbsolute(sourceFile)) {
    sourceFile = path.join(currentPath, sourceFile);
  }

  let destinationFile = path.join(destination, path.basename(sourceFile));

  const result = await cp(currentPath, [sourceFile, destinationFile])
    .then(result => result)
    .catch(result => result);

  if (!result.error) {
    await rm(currentPath, [sourceFile])
      .then(result => { resolve(result); })
      .catch(result => { reject(result); })
  } else {
    return Promise.reject(new Result(new OperationFailedError(result.error.message), false));
  }
}

export const rm = (currentPath, [source]) => {
  return new Promise((resolve, reject) => {Rm
    if (!source) {
      reject(new Result(new InvalidArgumentError(), false));
    }

    let fileToDelete = path.normalize(source);
    if (!path.isAbsolute(fileToDelete)) {
      fileToDelete = path.join(currentPath, fileToDelete);
    }

    fsRm(fileToDelete, err => {
      if (err) {
        reject(new Result(new InvalidArgumentError(err.message), false));
      }
      resolve(new Result(null, true))
    })
  })
}