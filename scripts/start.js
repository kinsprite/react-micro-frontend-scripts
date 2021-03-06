const runWebpack = require('./internal/runWebpack');

function start() {
  // --- ENV for 'development' only ---
  // process.env.DISABLE_DEV_SERVER = 'false';

  // --- ENV for ALL ---
  // process.env.ENSURE_NO_EXPORTS = 'false';
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  // process.env.SPLIT_CHUNKS = 'true';
  // process.env.RUNTIME_CHUNK = 'true';
  // process.env.POSTCSS_PRESET_ENV_STAGE = '3';

  // process.env.FRAMEWORK_PKG_NAME = 'react-micro-frontend-framework';
  // process.env.REACT_MICRO_FRONTEND_PKG_NAME_PREFIX= 'react-micro-frontend';

  // process.env.PREACT_MOBILE = 'false';

  runWebpack('development', (config) => {
    Object.assign(config, {
      devServer: {
      },
    });

    return config;
  });
}

module.exports = start;
