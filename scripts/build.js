const runWebpack = require('./internal/runWebpack');

function build() {
  // --- ENV for 'production' only ---
  // process.env.PUBLIC_DISABLE_REVISION = 'false'; // 'true' for caching optimization
  // process.env.PUBLIC_ROOT_URL = '/';
  // process.env.PUBLIC_URL = '/rmf-app-abc/'; // PUBLIC_URL will override PUBLIC_ROOT_URL
  // process.env.GENERATE_SOURCEMAP = 'true';
  // process.env.INLINE_RUNTIME_CHUNK = 'true';
  // process.env.MINIMIZE_IN_PRODUCTION = 'true';
  // process.env.GENERATE_INDEX_HTML = 'false';
  // process.env.WORKBOX_GENERATE_SW = 'false';
  // process.env.WORKBOX_INJECT_MANIFEST = 'false';

  // --- ENV for ALL ---
  // process.env.ENSURE_NO_EXPORTS = 'false';
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  // process.env.SPLIT_CHUNKS = 'true';
  // process.env.RUNTIME_CHUNK = 'true';
  // process.env.POSTCSS_PRESET_ENV_STAGE = '3';

  // process.env.FRAMEWORK_PKG_NAME = 'react-micro-frontend-framework';
  // process.env.REACT_MICRO_FRONTEND_PKG_NAME_PREFIX= 'react-micro-frontend';

  runWebpack('production');
}

module.exports = build;
