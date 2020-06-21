const webpack = require('webpack');

const build = require('./scripts/build');
const start = require('./scripts/start');
const helper = require('./scripts/helper');

const runWebpack = require('./scripts/internal/runWebpack');
const pkgJson = require('./scripts/internal/pkgJson');

module.exports = {
  build,
  start,
  helper,
  runWebpack,
  webpack,
  envDevelopment: 'development',
  envProduction: 'production',
  pkgJson,
};
