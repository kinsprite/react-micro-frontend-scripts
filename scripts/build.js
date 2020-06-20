const runWebpack = require('./internal/runWebpack');

function build() {
  // --- ENV for 'production' only ---
  // process.env.PUBLIC_ROOT_URL = '/';
  // process.env.GENERATE_SOURCEMAP = 'true';
  // process.env.INLINE_RUNTIME_CHUNK = 'true';

  // --- ENV for ALL ---
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  // process.env.ENABLE_SPLIT_CHUNKS = 'true';
  // process.env.ENABLE_RUNTIME_CHUNK = 'true';

  runWebpack('production');
}

module.exports = build;
