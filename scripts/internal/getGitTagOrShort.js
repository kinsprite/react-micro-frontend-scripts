const git = require('git-rev-sync');

const getAppDir = require('./getAppDir');

function getGitTagOrShort() {
  const long = git.long(getAppDir());
  // Generally, eight to ten characters are more than enough to be unique within a project.
  const short = long.substr(0, 8);

  if (git.isTagDirty()) {
    return { tag: '', short };
  }

  const tag = git.tag();
  return { tag, short };
}

module.exports = getGitTagOrShort;
