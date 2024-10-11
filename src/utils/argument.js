export const getArgValue = (args, key) => {
  const regex = new RegExp(`--${key}=.+`, 'i');
  const pair = args.filter(arg => arg.match(regex));
  return pair[0] ? pair[0].split('=')[1] : null;
}
