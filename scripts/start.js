const runWebpack = require('./internal/runWebpack');

function start() {
  // --- ENV for 'development' only ---
  // process.env.DISABLE_DEV_SERVER = 'false';

  // --- ENV for ALL ---
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  // process.env.SPLIT_CHUNKS = 'true';
  // process.env.RUNTIME_CHUNK = 'true';

  runWebpack('development', (config) => {
    Object.assign(config, {
      devServer: {
      },
    });

    return config;
  });
}

module.exports = start;
