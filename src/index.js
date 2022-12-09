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
    if (!input.startsWith(msg.invalidInput)) {
      const args = getNormalizedArgs(input);
      try {
        switch (args[0].toLowerCase()) {
          case '.exit':
            rl.close();
            break;
          default:
            console.log(msg.invalidInput);
        }
      } catch (error) {
        console.log(`${errorMessage.errorDefault}: ${error.message}${os.EOL}`);
      }
      printCurrentPath(currentPath);
    } else {
      process.stderr.write('Really invali');
    }
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

