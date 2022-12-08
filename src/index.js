import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const app = async () => {
  const args = process.argv.slice(2);

  const rl = readline.createInterface({ input, output });

  const answer = await rl.question('What do you think of Node.js? ');

  // rl.setPrompt(prompt);
  // rl.prompt([preserveCursor]);
  // rl.write(data[, key])

  rl.on('line', (input) => {
    console.log(`Received: ${input}`);
  });

  // rl.on('SIGINT', () => {
  //   rl.question('Are you sure you want to exit? ', (answer) => {
  //     if (answer.match(/^y(es)?$/i)) process.exit();
  //   });
  // });
  // console.log(`Thank you for your valuable feedback: ${answer}`);

  // rl.close();
};

app();