import os from 'node:os';
import * as readline from 'node:readline/promises';
import { join } from 'node:path';

import * as nav from './nav-commands.js';
import * as files from './files-commands.js';

import * as msg from './messages.js'
import { getArgValue, getNormalizedArgs } from './args.js'
import { InvalidArgumentError, OperationFailedError, WrongDoubleQuotersError } from './error.js';
import { color, setColor } from './colors.js';

const app = async () => {
  const currentUser = getArgValue(process.argv, 'username') || process.env.USERNAME || 'Anonymous';
  sayHi(currentUser);

  let currentPath = join(process.env.HOMEDRIVE, process.env.HOMEPATH);
  printCurrentPath(currentPath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.prompt();

  rl.on('line', async (input) => {
    let [error, args, result] = [null, null, null];
    [error, args] = getNormalizedArgs(input);
    if (!error) {
      const command = args[0]?.toLowerCase();

      if (nav[command]) {
        [error, currentPath] = nav[command](args, currentPath); //navigation & working directory
        // result = nav[command](args, currentPath); //navigation & working isDirectory
        // console.log('result: ', result);

      } else if (files[command]) {
        await files[command](currentPath, args) //operations with files
          .then(result => { error = result[0] });

      } else if (command === '.exit') {
        rl.close();

      } else {
        error = new InvalidArgumentError('unknown command');
      }
    }
    if (error) {
      if (error instanceof InvalidArgumentError ||
        error instanceof OperationFailedError ||
        error instanceof WrongDoubleQuotersError) {
        console.colorLog(color.red, error.message);
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
  console.colorLog(color.green, msg.welcomeMask.replace('%%USER%%', currentUser));
}

function printCurrentPath(currentPath) {
  console.log(msg.currentPathMask.replace('%%CURRENT_PATH%%', setColor(currentPath, color.cyan)));
}

function sayGooogbye(currentUser) {
  console.colorLog(color.green, msg.goodbyMask.replace('%%USER%%', currentUser));
  process.exit(0);
}

