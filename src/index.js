import os from 'node:os';
import * as readline from 'node:readline/promises';
import { join, resolve } from 'node:path';

import * as navigation from './navigation.js';

import * as msg from './messages.js'
import { getArgValue, getNormalizedArgs } from './args.js'
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';
import { color, setColor } from './colors.js';

const app = async () => {
  const currentUser = getArgValue(process.argv, 'username') || process.env.USERNAME || 'Anonymous';
  sayHi(currentUser);

  let currentPath = resolve(process.env.HOMEPATH);
  printCurrentPath(currentPath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.prompt();

  rl.on('line', (input) => {
    const args = getNormalizedArgs(input);
    const command = args[0]?.toLowerCase();
    try {
      if (navigation[command]) {
        currentPath = navigation[command](args, currentPath); //navigation & working directory
      } else if (command === '.exit') {
        rl.close();
      } else {
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
  console.log(msg.currentPathMask.replace('%%CURRENT_PATH%%', setColor(currentPath, color.cyan)));
}

function sayGooogbye(currentUser) {
  console.colored(color.green, msg.goodbyMask.replace('%%USER%%', currentUser));
  process.exit(0);
}

