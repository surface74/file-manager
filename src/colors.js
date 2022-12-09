export const color = {
  red: 31,
  green: 32,
  yellow: 33,
  white: 37
}

console.colored = (color, ...args) => {
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

export const setColor = (string, color) => (color) ? `\x1b[${color}m${string}\x1b[0m` : string;

