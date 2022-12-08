import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import * as CONST from './constants.js'
import {getArgValue} from './args.js'

console.log('process.argv: ', process.argv);

const app = async () => {
  const currentUser = getArgValue(process.argv, 'username');// || process.env.USERNAME;
  console.log(CONST.welcomeMask.replace('%%USER%%', currentUser));

  const rl = readline.createInterface({ input, output });

  // rl.write(CONST.welcomeMask.replace('%%USER%%', currentUser));

  rl.on('line', (input) => {
    console.log(`Received: ${input}`);
  });

  // rl.on('SIGINT', () => {
  //   rl.question('Are you sure you want to exit? ', (answer) => {
  //     if (answer.match(/^y(es)?$/i)) {
  //       ls.pause();
  //       process.exit();
  //     };
  //   })
  // });

  // rl.write(CONST.currentPathMask);
    // rl.setPrompt('>');
    // rl.prompt(true);
  // rl.write(data[, key])


  // console.log(`Thank you for your valuable feedback: ${answer}`);

  // rl.close();
};

app();