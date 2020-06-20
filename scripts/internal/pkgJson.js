const camelCase = require('camelcase');
const { paramCase } = require('param-case');

const resolvePath = require('./resolvePath');

function getPkgJson() {
  return require(resolvePath('package.json'));
}

function getReactMicroFrontendShort() {
  return process.env.REACT_MICRO_FRONTEND_SHORT || 'rmf';
}

function getMicroFrontendFolderName() {
  const pkgJson = getPkgJson();
  const shortRmf = getReactMicroFrontendShort();
  const names = `${pkgJson.name}`.replace('react-micro-frontend', shortRmf).split('/');
  const lastName = names[names.length - 1];
  return paramCase(lastName);
}

function getLibraryName() {
  return camelCase(getMicroFrontendFolderName());
}

function getMainEntryName() {
  const pkgJson = getPkgJson();
  const names = `${pkgJson.name}`.replace('react-micro-frontend', '').split('/');
  const lastName = names[names.length - 1];
  return paramCase(lastName);
}

function getRoutes() {
  const pkgJson = getPkgJson();
  return (Array.isArray(pkgJson.routes) && pkgJson.routes) || [];
}

module.exports = {
  getPkgJson,
  getReactMicroFrontendShort,
  getMicroFrontendFolderName,
  getLibraryName,
  getMainEntryName,
  getRoutes,
};
