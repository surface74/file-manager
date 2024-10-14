export const color = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37
}

const START_MARK = '\x1b[';
const END_MARK = '\x1b[0m';

export const setColor = (string, color) => (color) ? `${START_MARK}${color}m${string}${END_MARK}` : string;

export const colorLog = (color, ...args) => {
  if (color) {
    if (args[0]) {
      if (typeof (args[0] === 'string')) {
        args[0] = `${START_MARK}${color}m${args[0]}`;
      } else {
        args.unshift(`${START_MARK}${color}m`);
      }
      const lastIndex = args.length - 1;
      if (typeof (args[lastIndex] === 'string')) {
        args[lastIndex] = `${args[lastIndex]}${END_MARK}`;
      } else {
        args.push(`${END_MARK}`);
      }
    }
  }
  console.log(...args);
}


