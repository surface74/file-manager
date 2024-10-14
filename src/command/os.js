import * as nodeOs from 'node:os';
import { join } from 'node:path';

import { color, colorLog } from '../utils/colors.js';
import { InvalidArgumentError } from '../error.js';
import Message from '../message.js';

/**
 *
 * @param {string[]} param0
 */
export const os = ([keyInfo]) => {
  if (!keyInfo?.startsWith('--')) {
    throw new InvalidArgumentError(Message.DASHED_OPTION_REQUIRED);
  }

  const key = keyInfo.slice(2).toLowerCase();
  switch (key) {
    case 'eol':
      colorLog(color.green, `${JSON.stringify(nodeOs.EOL)}`);
      break;
    case 'cpus':
      const cpus = nodeOs.cpus();
      colorLog(color.green, `Total CPUs: ${cpus.length}`);
      console.table(cpus.map(cpu => ({ Model: cpu.model, "Clock rate": cpu.speed / 1000 })));
      break;
    case 'homedir':
      colorLog(color.green, `${join(process.env.HOMEDRIVE || '', process.env.HOMEPATH || '')}`);
      break;
    case 'username':
      colorLog(color.green, `${process.env.USERNAME}`);
      break;
    case 'architecture':
      colorLog(color.green, `${process.arch}`);
      break;
    default:
      throw new InvalidArgumentError(Message.INVALID_OPTION.replace('%%OPTION%%', keyInfo));
  }
}