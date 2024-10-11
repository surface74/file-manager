import * as readline from 'node:readline/promises';
import { join } from 'node:path';

import Message from './message.js';
import { getArgValue, getNormalizedArgs } from './utils/argument.js';
import { color, colorLog } from './utils/colors.js';

import * as navigation from './command/navigation.js';

const app = () => {
  const currentUser = getArgValue(process.argv, 'username') || Message.ANONIMOUS_USER;
  Message.sayHi(currentUser);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let homePath = join(process.env.HOMEDRIVE || '', process.env.HOMEPATH || '');

  process.chdir(homePath);

  Message.printCurrentPath();

  rl.prompt();

  rl.on('line', async (input) => {
    let error, result, args;
    ({ error, data: args } = getNormalizedArgs(input));

    if (!error && args.length) {
      const command = args.shift().toLowerCase();

      if (navigation[command]) { // navigation
        ({ error, data: result } = await navigation[command](args));
      }
    }

    if (error) {
      colorLog(color.red, error.message);
    }

    Message.printCurrentPath();
    rl.prompt();
  });

  rl.on('close', () => {
    console.log();
    Message.sayGoodbye(currentUser);
    process.exit(0);
  });
};

export default app;
