import {getArgValue} from './args.js'

let argv = ['','','--username=Andry'];
console.log(getArgValue(argv, 'username'));
argv = ['','','--usernme=Andry'];
console.log(getArgValue(argv, 'username'));
argv = ['','','--username='];
console.log(getArgValue(argv, 'username'));