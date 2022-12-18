import { normalize, join, dirname, isAbsolute } from 'node:path';
import { createReadStream, createWriteStream, access, constants } from 'node:fs';
import { pipeline } from 'node:stream';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

import { Result } from './result.js';
import { InvalidArgumentError, OperationFailedError } from './error.js';

export const compress = (currentPath, [source, resultFile]) => {
  return new Promise((resolve, reject) => {
    if (!source) {
      reject(new Result(new InvalidArgumentError(), false));
    }

    let sourceFile = normalize(source);
    if (!isAbsolute(sourceFile)) {
      sourceFile = join(currentPath, sourceFile);
    }

    let compressedFile = (resultFile) ? normalize(resultFile) : sourceFile + '.br';
    if (!isAbsolute(compressedFile)) {
      compressedFile = join(dirname(sourceFile), compressedFile);
    }

    access(compressedFile, constants.F_OK, (err) => {
      if (!err) {
        reject(new Result(new InvalidArgumentError(`file ${compressedFile} already exists`), false));
      } else {
        pipeline(
          createReadStream(sourceFile),
          createBrotliCompress(),
          createWriteStream(compressedFile),
          err => {
            if (err) {
              reject(new Result(new OperationFailedError(err.message), false));
            }
            resolve(new Result(null, true));
          });
      }
    });
  })
};

export const decompress = (currentPath, [source, result]) => {
  return new Promise((resolve, reject) => {
    if (!result) {
      reject(new Result(new InvalidArgumentError('must be passed 2 parameters'), false));
    }

    let compressedFile = normalize(source);
    if (!isAbsolute(compressedFile)) {
      compressedFile = join(currentPath, compressedFile);
    }

    let resultFile = normalize(result);
    if (!isAbsolute(resultFile)) {
      resultFile = join(dirname(compressedFile), resultFile);
    }

    access(resultFile, constants.F_OK, (err) => {
      if (!err) {
        reject(new Result(new InvalidArgumentError(`file ${resultFile} already exists`), false));
      } else {
        pipeline(
          createReadStream(compressedFile),
          createBrotliDecompress(),
          createWriteStream(resultFile),
          err => {
            if (err) {
              reject(new Result(new OperationFailedError(err.message), false));
            }
            resolve(new Result(null, true));
          });
      }
    });
  })
};