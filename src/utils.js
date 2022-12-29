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

/**
 * Calculate absolute path from relative
 * @param {string} basePath The current directory
 * @param {string} path The relative/absolute path
 * @returns {string} The absolute path
 */
export const normalizePath = (basePath, folderPath) => {

  if (folderPath.endsWith(':')) {
    return `${folderPath}${path.sep}`;
  }

  if (folderPath.match(/^\.\.[\\/]?$/) !== null) {
    return path.join(path.dirname(basePath), folderPath);
  }

  if (folderPath.match(/^[\\/]$/) !== null) {
    return path.parse(basePath).root;
  }

  if (!path.isAbsolute(folderPath)) {
    return path.join(basePath, folderPath);
  }

  return folderPath;
}