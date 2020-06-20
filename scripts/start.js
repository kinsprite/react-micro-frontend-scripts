const runWebpack = require('./internal/runWebpack');

function start() {
  process.env.DISABLE_DEV_SERVER = 'false';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';

  runWebpack('development', (config) => {
    Object.assign(config, {
      devServer: {
      },
    });

    return config;
  });
}

module.exports = start;
