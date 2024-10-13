import * as readline from 'node:readline/promises';
import { join } from 'node:path';

import Message from './message.js';
import { getArgValue, getNormalizedArgs } from './utils/argument.js';
import { color, colorLog } from './utils/colors.js';

import * as navigation from './command/navigation.js';
import * as files from './command/files.js';
import { os } from './command/os.js';
import { hash } from './command/hash.js';

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
    try {
      const args = getNormalizedArgs(input);

      if (args.length) {
        const command = args.shift().toLowerCase();

        if (navigation[command]) { // navigation
          await navigation[command](args);

        } else if (files[command]) { // files
          await files[command](args);

        } else if ('os' === command) { // os
          os(args);

        } else if ('hash' === command) { // hash
          await hash(args);

        }

      }
    } catch (error) {
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
