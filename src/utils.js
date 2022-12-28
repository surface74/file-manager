import * as path from 'node:path';

/**
 * Return path as basePath + pathTail, if pathTail isn't absolute path or tailPath itseft if not
 * @param {string} basePath The first part of absolute path
 * @param {string} pathTail The apth to examine
 * @returns {string}
 */
export const getAbsolutePath = (basePath, pathTail) => {
  return path.isAbsolute(pathTail) ? pathTail : path.join(basePath, path.normalize(pathTail));
}