const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const tcpPortUsed = require('tcp-port-used');

const paths = require('../config/paths');
const getPublicUrlOrPath = require('./getPublicUrlOrPath');

const webpackConfig = require('../config/webpack.config');

const error = chalk.bold.red;
const warning = chalk.keyword('orange');

function webpackCallback(err, stats) {
  if (err) {
    console.log(error('Failed to compile.'));
    console.log(error(err.stack || err));

    if (err.details) {
      console.log(error(err.details));
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.log(error('Failed to compile.'));
    console.log(error(info.errors));
  }

  if (stats.hasWarnings()) {
    console.log(warning('Compiled with warnings.\n'));
    console.log(warning(info.warnings));
  }
}

/**
 * run webpack
 * @param {string} env 'development' or 'production'
 * @param {Function=} onHookWebpackConfig Function: (webpack.Configuration) => webpack.Configuration
 */
module.exports = (env, onHookWebpackConfig) => {
  if (env) {
    process.env.BABEL_ENV = env;
    process.env.NODE_ENV = env;
  }

  let config = webpackConfig(env);

  if (onHookWebpackConfig) {
    config = onHookWebpackConfig(config);
  }

  if (env === 'development' && process.env.DISABLE_DEV_SERVER !== 'true') {
    const publicUrlOrPath = getPublicUrlOrPath(true);

    const devServerOptions = {
      port: 9000,
      contentBase: paths.public(),
      contentBasePublicPath: publicUrlOrPath,
      watchContentBase: true,
      hot: true,
      injectClient: true,
      // publicPath: getPublicUrlOrPath(true),
      historyApiFallback: {
        disableDotRule: true,
        index: publicUrlOrPath,
      },
      open: true,
      stats: {
        colors: true,
      },
      ...config.devServer,
    };

    const host = devServerOptions.host || '127.0.0.1';
    const startPort = devServerOptions.port;
    const endPort = startPort + 30;

    let port = startPort;

    const checkPortAndRun = () => {
      if (port > endPort) {
        console.log(error(`No free port [${startPort}-${endPort}] for WebpackDevServer!`));
        return;
      }

      tcpPortUsed.check(port, host).then((isUse) => {
        if (isUse) {
          port += 1;
          checkPortAndRun();
        } else {
          const compiler = webpack(config);
          devServerOptions.port = port;
          const server = new WebpackDevServer(compiler, devServerOptions);

          server.listen(port, host, () => {
            console.log(`Starting server on http://${host}:${port}`);
          });
        }
      }, () => {
        port += 1;
        checkPortAndRun();
      });
    };

    checkPortAndRun();
  } else {
    webpack(config, webpackCallback);
  }
};
