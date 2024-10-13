import { InvalidArgumentError } from '../error.js';
import Message from '../message.js';

export const getArgValue = (args, key) => {
  const regex = new RegExp(`--${key}=.+`, 'i');
  const pair = args.filter(arg => arg.match(regex));

  return pair[0] ? pair[0].split('=')[1] : null;
}

export function getNormalizedArgs(commandLine) {
  if (typeof commandLine !== 'string') {
    throw new InvalidArgumentError(Message.MUST_BE_STRING);
  }

  const doubleQuotersCount = commandLine.match(/"/g);
  if (commandLine.match(/""/) ||
    doubleQuotersCount && doubleQuotersCount.length % 2 !== 0) {
    throw new InvalidArgumentError(Message.WRONG_DOUBLE_QUOTERS);
  }

  let args = [];
  const cmd = commandLine.trim();
  if (doubleQuotersCount) {
    const parts = [];
    let startPosition = 0;
    let part = null;
    while (part = cmd.slice(startPosition).match(/"[^"]+"/)) {
      if (part.index) {
        parts.push(...cmd.slice(startPosition, part.index - startPosition).split(' '));
        parts.push(part[0]);
        startPosition += part.index + part[0].length;
      }
    }
    const rest = cmd.slice(startPosition);
    if (rest) {
      parts.push(rest);
    }
    args = parts.map(item => item.replace(/"/g, '').trim()).filter(item => item);
  } else {
    args = cmd.split(' ').map(item => item.trim()).filter(item => item);
  }

  return args;
}