import * as path from 'node:path';

export const getAbsolutePath = (entityPath) => {
  return path.isAbsolute(entityPath) ? entityPath : path.resolve(entityPath);
}
