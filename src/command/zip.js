import * as path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

import { InvalidArgumentError, OperationFailedError } from '../error.js';
import { getAbsolutePath } from '../utils/path-utils.js';
import Message from '../message.js';
import { pipeline } from 'node:stream/promises';
import { access, constants } from 'node:fs/promises';

const ZIP_EXTENTION = '.br';

export const compress = async ([source, resultPath]) => {
  if (!source || !resultPath) {
    throw new InvalidArgumentError(Message.NEED_2_ARGS);
  }

  let sourceFile = getAbsolutePath(source);
  let compressPath = getAbsolutePath(resultPath);
  let fileToCompess = path.join(compressPath, path.parse(sourceFile).base + ZIP_EXTENTION);


  try {
    await access(sourceFile, constants.R_OK);

    const readStream = createReadStream(sourceFile);
    const transformStream = createBrotliCompress();
    const writeStream = createWriteStream(fileToCompess, { flags: 'wx' });

    await pipeline(readStream, transformStream, writeStream);
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
};

export const decompress = ([source, resultPath]) => {
  if (!source || !resultPath) {
    throw new InvalidArgumentError(Message.NEED_2_ARGS);
  }

  let sourceFile = getAbsolutePath(source);
  let decompressPath = getAbsolutePath(resultPath);
  let fileToDecompess = path.join(decompressPath, path.parse(sourceFile).name);

  return new Promise((resolve, reject) => {
    const readStream = createReadStream(sourceFile);
    const transformStream = createBrotliDecompress();
    const writeStream = createWriteStream(fileToDecompess, { flags: 'wx' });

    readStream.pipe(transformStream).pipe(writeStream);
    readStream.on('error', error => reject(new OperationFailedError(error.message)));
    readStream.on('end', () => resolve(null));

    writeStream.on('error', error => reject(new OperationFailedError(error.message)));
  });
};
