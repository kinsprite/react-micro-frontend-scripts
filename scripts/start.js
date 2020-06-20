const runWebpack = require('./internal/runWebpack');

function start() {
  // --- ENV for 'development' only ---
  // process.env.DISABLE_DEV_SERVER = 'false';

  // --- ENV for ALL ---
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  // process.env.ENABLE_SPLIT_CHUNKS = 'true';
  // process.env.ENABLE_RUNTIME_CHUNK = 'true';

  runWebpack('development', (config) => {
    Object.assign(config, {
      devServer: {
      },
    });

    return config;
  });
}

module.exports = start;
