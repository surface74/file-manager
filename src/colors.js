/**
 *https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors
 */
export const color = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37
}

export const setColor = (string, color) => (color) ? `\x1b[${color}m${string}\x1b[0m` : string;

console.colorLog = (color, ...args) => {
  if (color) {
    if (args[0]) {
      if (typeof (args[0] === 'string')) {
        args[0] = `\x1b[${color}m${args[0]}`;
      } else {
        args.unshift(`\x1b[${color}m`);
      }
      const lastIndex = args.length - 1;
      if (typeof (args[lastIndex] === 'string')) {
        args[lastIndex] = `${args[lastIndex]}\x1b[0m`;
      } else {
        args.push(`\x1b[0m`);
      }
    }
  }
  console.log(...args);
}


