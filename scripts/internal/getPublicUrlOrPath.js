const { paramCase } = require('param-case');

const pkgJson = require('./pkgJson');
const getGitTagOrShort = require('./getGitTagOrShort');

function getRevisionPath() {
  const gitRev = getGitTagOrShort();

  if (gitRev.tag) {
    return paramCase(gitRev.tag, { stripRegexp: /[^A-Z0-9\\.]/gi });
  }

  return gitRev.short;
}

function getPublicUrl(isEnvDevelopment) {
  let publicURL = process.env.PUBLIC_URL || '';
  // ensure last slash exists
  if (publicURL) {
    publicURL = publicURL.endsWith('/') ? publicURL : `${publicURL}/`;
  }

  if (isEnvDevelopment) {
    return publicURL.startsWith('.') ? '/' : (publicURL || '/');
  }

  return publicURL;
}

function getPublicUrlOrPath(isEnvDevelopment) {
  if (process.env.PUBLIC_URL || process.env.PUBLIC_UR === '') {
    return getPublicUrl(isEnvDevelopment);
  }

  let publicRootURL = process.env.PUBLIC_ROOT_URL || '';
  const disableRevision = process.env.PUBLIC_DISABLE_REVISION === 'true';

  // ensure last slash exists
  if (publicRootURL) {
    publicRootURL = publicRootURL.endsWith('/') ? publicRootURL : `${publicRootURL}/`;
  }

  if (isEnvDevelopment) {
    return publicRootURL.startsWith('.') ? '/' : (publicRootURL || '/');
  }

  const folderName = pkgJson.getMicroFrontendFolderName();
  // must add the end '/'
  return disableRevision ? `${publicRootURL}${folderName}/` : `${publicRootURL}${folderName}/${getRevisionPath()}/`;
}

module.exports = getPublicUrlOrPath;
