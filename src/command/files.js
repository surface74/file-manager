import * as path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat, writeFile, rename, rm as rmNode } from 'node:fs/promises';
import { stdout } from 'node:process';
import { pipeline } from 'node:stream/promises';

import { InvalidArgumentError, OperationFailedError } from '../error.js';
import Message from '../message.js';
import { getAbsolutePath } from '../utils/path-utils.js';

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

  try {
    await writeFile(fullPath, '', { flag: 'wx' });
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
};

export const rn = async ([source, newName]) => {
  if (!source || !newName) {
    throw new InvalidArgumentError(Message.NEED_2_ARGS);
  }

  if (path.isAbsolute(newName)) {
    throw new InvalidArgumentError(Message.SECOND_ARG_FILE_NAME);
  }

  let sourceFile = getAbsolutePath(source);
  let destinationFile = path.join(path.dirname(sourceFile), newName);

  try {
    await stat(destinationFile);
  } catch (error) {
    try {
      await rename(sourceFile, destinationFile);
    } catch (error) {
      throw new OperationFailedError(error.message);
    }
    return;
  }
  throw new OperationFailedError(Message.FILE_EXISTS.replace('%%FILE%%', destinationFile));
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

export const rm = async ([source]) => {
  if (!source) {
    throw new InvalidArgumentError();
  }

  const fileToDelete = getAbsolutePath(source);

  try {
    await rmNode(fileToDelete);
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
}

export const mv = async ([source, destination]) => {
  if (!source || !destination) {
    throw new InvalidArgumentError(Message.NEED_2_ARGS);
  }

  const sourceFile = getAbsolutePath(source);

  try {
    await cp([sourceFile, destination]);
    await rm([sourceFile]);
  } catch (error) {
    throw new OperationFailedError(error.message);
  }
}