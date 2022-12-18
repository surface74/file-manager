import * as nodeOs from 'node:os';
import { join } from 'node:path';

import { Result } from './result.js';
import { color } from './colors.js';
import { InvalidArgumentError, OperationFailedError } from './error.js';

export const os = (args) => {
  if (!args[1] || !args[1].startsWith('--')) {
    return new Result(new InvalidArgumentError('valid option has to start with "--"'), false);
  }

  const key = args[1].slice(2).toLowerCase();
  switch (key) {
    case 'eol':
      // console.colorLog(color.green, `Default system End-Of-Line: ${JSON.stringify(nodeOs.EOL)}`);
      console.colorLog(color.green, `${JSON.stringify(nodeOs.EOL)}`);
      break;
    case 'cpus':
      const cpus = nodeOs.cpus();
      console.colorLog(color.green, `Total CPUs: ${cpus.length}`);
      console.table(cpus.map(cpu => ({ Model: cpu.model, Speed: cpu.speed })));
      break;
    case 'homedir':
      // console.colorLog(color.green, `Home directory: ${join(process.env.HOMEDRIVE, process.env.HOMEPATH)}`);
      console.colorLog(color.green, `${join(process.env.HOMEDRIVE, process.env.HOMEPATH)}`);
      break;
    case 'username':
      // console.colorLog(color.green, `System user name: ${process.env.USERNAME}`);
      console.colorLog(color.green, `${process.env.USERNAME}`);
      break;
    case 'architecture':
      // console.colorLog(color.green, `CPU architecture for which Node.js binary has compiled: ${process.arch}`);
      console.colorLog(color.green, `${process.arch}`);
      break;
    default:
      return new Result(new InvalidArgumentError(`bad option ${args[1]}`), false);
  }
  return new Result(null, true);
}