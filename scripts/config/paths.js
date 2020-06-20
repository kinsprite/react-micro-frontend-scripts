const resolvePath = require('../internal/resolvePath');

module.exports = {
  appRoot: () => resolvePath('.'),
  src: () => resolvePath('src'),
  devTmp: () => resolvePath('.tmp'),
  prodDist: () => resolvePath('dist'),
  nodeModules: () => resolvePath('node_modules'),
  mainEntry: () => resolvePath('src/index'),
  template: () => resolvePath('public/index.html'),
  pkgJson: () => resolvePath('package.json'),
};
