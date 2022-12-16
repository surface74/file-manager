import { WrongDoubleQuotersError, InvalidArgumentError } from './error.js';

export const getArgValue = (args, key) => {
  const regex = new RegExp(`--${key}=.+`, 'i');
  const pair = args.filter(arg => arg.match(regex));
  return pair[0] ? pair[0].split('=')[1] : undefined;
}

export function getNormalizedArgs(commandLine) {
  if (typeof commandLine !== 'string') {
    return [new InvalidArgumentError('arguments have to be string'), null];
  }
  const doubleQuotersCount = commandLine.match(/"/g);
  if (commandLine.match(/""/) ||
    doubleQuotersCount && doubleQuotersCount.length % 2 !== 0) {
    return [new WrongDoubleQuotersError(), null];
  }
  let args = [];
  const cmd = commandLine.trim();
  if (doubleQuotersCount) {
    const parts = [];
    let startPosition = 0;
    let part = null;
    while (part = cmd.slice(startPosition).match(/"[^"]+"/)) {
      parts.push(...cmd.slice(startPosition, part.index - startPosition).split(' '));
      parts.push(part[0]);
      startPosition += part.index + part[0].length;
    }
    const rest = cmd.slice(startPosition);
    if (rest) {
      parts.push(rest);
    }
    args = parts.map(item => item.replace(/"/g, '').trim()).filter(item => item);
  } else {
    args = cmd.split(' ').map(item => item.trim()).filter(item => item);
  }

  return [null, args];
  // const parts = commandLine.trim().split(' ');
  // console.log('parts: ', parts);
  // // const args = [];
  // for (let i = 0; i < parts.length; i++) {
  //   let arg = parts[i];
  //   if (arg.startsWith('"')) {
  //     do {
  //       arg += ` ${parts[++i]}`;
  //     } while (!parts[i].endsWith('"'))
  //     arg = arg.replace(/"/g, '').trim();
  //   }
  //   if (arg) {
  //     args.push(arg);
  //   }
  // }
  // return [null, args];
}

// export function getNormalizedArgs(commandLine) {
//   if (typeof commandLine !== 'string') {
//     return [new InvalidArgumentError('arguments have to be string'), null];
//   }
//   const doubleQuotersCount = commandLine.match(/"/g);
//   if (commandLine.match(/""/) ||
//     doubleQuotersCount && doubleQuotersCount.length % 2 !== 0) {
//     return [new WrongDoubleQuotersError(), null];
//   }
//   const parts = commandLine.trim().split(' ');
//   console.log('parts: ', parts);
//   const args = [];
//   for (let i = 0; i < parts.length; i++) {
//     let arg = parts[i];
//     if (arg.startsWith('"')) {
//       do {
//         arg += ` ${parts[++i]}`;
//       } while (!parts[i].endsWith('"'))
//       arg = arg.replace(/"/g, '').trim();
//     }
//     if (arg) {
//       args.push(arg);
//     }
//   }
//   return [null, args];
// }
