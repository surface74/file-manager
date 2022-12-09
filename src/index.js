import os from 'node:os';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { join, resolve } from 'node:path';

import * as CONST from './constants.js'
import { getArgValue } from './args.js'

const app = async () => {
  const currentUser = getArgValue(process.argv, 'username') || process.env.USERNAME || 'Anonymous';
  console.log(CONST.welcomeMask.replace('%%USER%%', currentUser));

  const currentPath = resolve(process.env.HOMEPATH);
  printCurrentPath(currentPath);

  const rl = readline.createInterface({ input, output });
  rl.prompt();
  // rl.write(CONST.welcomeMask.replace('%%USER%%', currentUser));

  rl.on('line', (input) => {
    const commandArgs = getNormalizedArgs(input);
    try {
      switch (commandArgs[0]) {
        default:
      }
    } catch (error) {
      rl.write(error.message + os.EOL);
    }
    printCurrentPath(currentPath);
    rl.prompt();
  });

  // rl.on('SIGINT', () => {
  //   rl.question('Are you sure you want to exit? ', (answer) => {
  //     if (answer.match(/^y(es)?$/i)) {
  //       ls.pause();
  //       process.exit();
  //     };
  //   })
  // });



  // console.log(`Thank you for your valuable feedback: ${answer}`);

  // rl.close();
};

app();

function printCurrentPath(currentPath) {
  console.log(CONST.currentPathMask.replace('%%CURRENT_PATH%%', currentPath));
}

