import * as path from 'path';
import { createReadStream, createWriteStream, constants, existsSync, rename, access } from 'node:fs';
import { stdout } from 'node:process';

import { Result } from './result.js'
import { color } from './colors.js';
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
      console.colorLog(color.green, `File created: ${writeStream.path}`);
      writeStream.close();
      resolve(new Result(null, true))
    });
  })
};

export const rn = (currentPath, args) => {
  return new Promise((resolve, reject) => {
    if (args.length < 3) {
      reject(new Result(new InvalidArgumentError(), false));
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
          } else {
            console.colorLog(color.green, `New file name: ${destinationFile}`);
            resolve(new Result(null, true));
          }
        });
      }
    });
  })
};

export const copy = (currentPath, args) => {
  return new Promise((resolve, reject) => {
    if (args.length < 3) {
      reject(new Result(new InvalidArgumentError(), false));
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
      console.colorLog(color.green, `File ${sourceFile} copied to ${destinationFile}`);
      resolve(new Result(null, true))
    });

    readStream.on('error', error =>
      reject(new Result(new OperationFailedError(error.message), false)));

    // readStream.on('end', () => {
    //   console.colorLog(color.green, `File ${sourceFile} has been read`);
    //   resolve(new Result(null, true));
    // });
  })
}