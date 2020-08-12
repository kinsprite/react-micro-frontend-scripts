const webpack = require('webpack');

const build = require('./scripts/build');
const start = require('./scripts/start');
const helper = require('./scripts/helper');
const paths = require('./scripts/config/paths');

const resolvePath = require('./scripts/internal/resolvePath');
const runWebpack = require('./scripts/internal/runWebpack');
const pkgJson = require('./scripts/internal/pkgJson');

module.exports = {
  build,
  start,
  helper,
  paths,
  resolvePath,
  runWebpack,
  webpack,
  envDevelopment: 'development',
  envProduction: 'production',
  pkgJson,
};
