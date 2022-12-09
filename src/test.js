import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('__dirname: ', __dirname);
console.log('import.meta.url: ', import.meta.url);
console.log('path.isAbsolute(import.meta.url): ', path.isAbsolute(import.meta.url));
console.log('path.dirname: ', path.dirname(__dirname));
console.log('path.dirname("d:\\"): ', path.dirname(path.dirname('d:\\')));


// import { color } from './colors.js';
// console.colored(color.yellow, 'Test', 'Second');


// import { getNormalizedArgs } from './args.js';

// let commandLine = 'copy '
// console.log(getNormalizedArgs(commandLine));
// commandLine = '  copy   D:\\text.txt C:\\';
// console.log(getNormalizedArgs(commandLine));
// commandLine = 'copy D:\\text.txt C:\\';
// console.log(getNormalizedArgs(commandLine));
// commandLine = 'copy "D:\\Storage    arch\\text.txt" C:\\';
// console.log(getNormalizedArgs(commandLine));
// commandLine = 'copy false  0  null --force " D:\\Storage    arch\\text.txt" C:\\';
// console.log(getNormalizedArgs(commandLine));
// commandLine = '';
// console.log(getNormalizedArgs(commandLine)[0]);

// console.log(getNormalizedArgs([...process.argv.slice(2)]));
// import {getArgValue} from './args.js'

// let argv = ['','','--username=Andry'];
// console.log(getArgValue(argv, 'username'));
// argv = ['','','--usernme=Andry'];
// console.log(getArgValue(argv, 'username'));
// argv = ['','','--username='];
// console.log(getArgValue(argv, 'username'));