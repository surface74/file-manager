import os from 'node:os';
import * as readline from 'node:readline/promises';
import { join, resolve } from 'node:path';

import * as msg from './messages.js'
import { getArgValue, getNormalizedArgs } from './args.js'
import * as errorMessage from './error.js';

const app = async () => {
  const currentUser = getArgValue(process.argv, 'username') || process.env.USERNAME || 'Anonymous';
  console.log(msg.welcomeMask.replace('%%USER%%', currentUser));

  const currentPath = resolve(process.env.HOMEPATH);
  printCurrentPath(currentPath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.prompt();

  rl.on('line', (input) => {
    const args = getNormalizedArgs(input);
    try {
      switch (args[0].toLowerCase()) {
        case '.exit':
          rl.close();
          break;
        default:
      }
    } catch (error) {
      rl.write(`${errorMessage.errorDefault}: ${error.message}${os.EOL}`);
    }
    printCurrentPath(currentPath);
    rl.prompt();
  });

  rl.on('close', () => {
    sayGooogbye(currentUser);
  });
};

app();

function printCurrentPath(currentPath) {
  console.log(msg.currentPathMask.replace('%%CURRENT_PATH%%', currentPath));
}

function sayGooogbye(currentUser) {
  console.log(msg.goodbyMask.replace('%%USER%%', currentUser));
  process.exit(0);
}

