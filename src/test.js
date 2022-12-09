import { getNormalizedArgs } from './args.js';
console.log(process.argv);
console.log([...process.argv.slice(2)]);

let commandLine = 'copy '
console.log(getNormalizedArgs(commandLine));
commandLine = '  copy   D:\\text.txt C:\\';
console.log(getNormalizedArgs(commandLine));
commandLine = 'copy D:\\text.txt C:\\';
console.log(getNormalizedArgs(commandLine));
commandLine = 'copy "D:\\Storage    arch\\text.txt" C:\\';
console.log(getNormalizedArgs(commandLine));
commandLine = 'copy false  0  null --force " D:\\Storage    arch\\text.txt" C:\\';
console.log(getNormalizedArgs(commandLine));

// console.log(getNormalizedArgs([...process.argv.slice(2)]));
// import {getArgValue} from './args.js'

// let argv = ['','','--username=Andry'];
// console.log(getArgValue(argv, 'username'));
// argv = ['','','--usernme=Andry'];
// console.log(getArgValue(argv, 'username'));
// argv = ['','','--username='];
// console.log(getArgValue(argv, 'username'));