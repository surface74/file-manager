import os from 'node:os';
import * as readline from 'node:readline/promises';
import { join, resolve } from 'node:path';

import * as msg from './messages.js'
import { getArgValue, getNormalizedArgs } from './args.js'
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';
import { color } from './colors.js';

const app = async () => {
  const currentUser = getArgValue(process.argv, 'username') || process.env.USERNAME || 'Anonymous';
  sayHi(currentUser);

  const currentPath = resolve(process.env.HOMEPATH);
  printCurrentPath(currentPath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.prompt();

  rl.on('line', (input) => {
    try {
      const args = getNormalizedArgs(input);
      switch (args[0]?.toLowerCase()) {
        case '.exit':
          rl.close();
          break;
        default:
          throw new InvalidArgumentError();
      }
    } catch (error) {
      if (error instanceof InvalidArgumentError ||
        error instanceof OperationFailedError ||
        error instanceof WrongDoubleQuotersError) {
        console.colored(color.red, error.message);
      } else {
        throw error;
      }
    }
    printCurrentPath(currentPath);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log();
    sayGooogbye(currentUser);
  });
};

app();

function sayHi(currentUser) {
  console.colored(color.green, msg.welcomeMask.replace('%%USER%%', currentUser));
}

function printCurrentPath(currentPath) {
  console.log(msg.currentPathMask.replace('%%CURRENT_PATH%%', currentPath));
}

function sayGooogbye(currentUser) {
  console.colored(color.green, msg.goodbyMask.replace('%%USER%%', currentUser));
  process.exit(0);
}

