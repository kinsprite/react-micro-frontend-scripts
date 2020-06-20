const webpack = require('webpack');

const build = require('./scripts/build');
const start = require('./scripts/start');

const runWebpack = require('./scripts/internal/runWebpack');
const pkgJson = require('./scripts/internal/pkgJson');

module.exports = {
  build,
  start,
  runWebpack,
  webpack,
  envDevelopment: 'development',
  envProduction: 'production',
  pkgJson,
};
