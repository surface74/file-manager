import * as readline from 'node:readline/promises';
import { join } from 'node:path';

import Message from './message.js';
import { getArgValue } from './utils/argument.js';

const app = () => {
  const currentUser = getArgValue(process.argv, 'username') || Message.ANONIMOUS_USER;
  Message.sayHi(currentUser);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let currentPath = join(process.env.HOMEDRIVE || '', process.env.HOMEPATH || '');
  Message.printCurrentPath(currentPath);

  rl.prompt();

  rl.on('line', async (input) => {

    Message.printCurrentPath(currentPath);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log();
    Message.sayGoodbye(currentUser);
    process.exit(0);
  });
};

export default app;
