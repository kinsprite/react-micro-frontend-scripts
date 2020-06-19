const runWebpack = require('./internal/runWebpack');

function start() {
  process.env.DISABLE_DEV_SERVER = 'false';

  runWebpack('development', (config) => {
    Object.assign(config, {
      devServer: {
      },
    });

    return config;
  });
}

module.exports = start;
