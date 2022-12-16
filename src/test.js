import {getNormalizedArgs} from './args.js'

let cmd = 'add " d d  " fg';
console.log(`getNormalizedArgs(${cmd}): `, getNormalizedArgs(cmd));
cmd= 'add "d  d" "f"'
console.log(`getNormalizedArgs(${cmd}): `, getNormalizedArgs(cmd));
cmd= 'add d "f f"'
console.log(`getNormalizedArgs(${cmd}): `, getNormalizedArgs(cmd));
cmd= 'add d "f "f'
console.log(`getNormalizedArgs(${cmd}): `, getNormalizedArgs(cmd));
