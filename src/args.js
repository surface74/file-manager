import { WrongDoubleQuotersError } from './error.js';

export const getArgValue = (args, key) => {
  const regex = new RegExp(`--${key}=.+`, 'i');
  const pair = args.filter(arg => arg.match(regex));
  return pair[0] ? pair[0].split('=')[1] : undefined;
}

export function getNormalizedArgs(commandLine) {
  const doubleQuotersCount = commandLine.match(/"/g);
  if (doubleQuotersCount && doubleQuotersCount.length % 2 !== 0) {
    return [new WrongDoubleQuotersError(), null];
  }
  const parts = commandLine.trim().split(' ');
  const args = [];
  for (let i = 0; i < parts.length; i++) {
    let arg = parts[i];
    if (arg.startsWith('"')) {
      do {
        arg += ` ${parts[++i]}`;
      } while (!parts[i].endsWith('"'))
      arg = arg.replace(/"/g, '').trim();
    }
    if (arg) {
      args.push(arg);
    }
  }
  return [null, args];
}
