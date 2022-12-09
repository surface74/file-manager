import {dirname} from 'node:path';


export const up = (args, currentPath) => {
  return dirname(currentPath);
}