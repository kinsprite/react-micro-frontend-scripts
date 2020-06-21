const camelCase = require('camelcase');
const { paramCase } = require('param-case');

const resolvePath = require('./resolvePath');

function getPkgJson() {
  return require(resolvePath('package.json'));
}

function getPkgNamePrefix() {
  return process.env.REACT_MICRO_FRONTEND_PKG_NAME_PREFIX || 'react-micro-frontend';
}

function getReactMicroFrontendShort() {
  return process.env.REACT_MICRO_FRONTEND_SHORT || 'rmf';
}

/**
 * @param {string} [pkgName] Optional pkgName
 */
function getMicroFrontendFolderName(pkgName) {
  const pkgJson = getPkgJson();
  const shortRmf = getReactMicroFrontendShort();
  const names = `${pkgName || pkgJson.name}`.replace(getPkgNamePrefix(), shortRmf).split('/');
  const lastName = names[names.length - 1];
  return paramCase(lastName);
}

/**
 * @param {string} [pkgName] optional pkg name
 */
function getLibraryName(pkgName) {
  return camelCase(getMicroFrontendFolderName(pkgName));
}

/**
 * @param {string} [pkgName] Optional pkgName
 */
function getMainEntryName(pkgName) {
  const pkgJson = getPkgJson();
  const names = `${pkgName || pkgJson.name}`.replace(getPkgNamePrefix(), '').split('/');
  const lastName = names[names.length - 1];
  return paramCase(lastName);
}

function getRoutes() {
  const pkgJson = getPkgJson();
  return (Array.isArray(pkgJson.routes) && pkgJson.routes) || [];
}

module.exports = {
  getPkgJson,
  getPkgNamePrefix,
  getReactMicroFrontendShort,
  getMicroFrontendFolderName,
  getLibraryName,
  getMainEntryName,
  getRoutes,
};
