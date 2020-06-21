const pkgJson = require('./internal/pkgJson');

const frameworkPkgName = 'react-micro-frontend-framework';

const frameworkVendorExportsDefault = {
  // [module]: Variable
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router-dom': 'ReactRouterDOM',
  redux: 'Redux',
  'react-redux': 'ReactRedux',
  rxjs: 'RxJS',
  'redux-observable': 'ReduxObservable',
  'redux-saga': 'ReduxSaga',
};

/**
 * @param {*} [frameworkVendorExports]
 */
function getExternalsOptions(frameworkVendorExports) {
  const frameworkVarName = pkgJson.getLibraryName(
    process.env.FRAMEWORK_PKG_NAME || frameworkPkgName,
  );

  return Object.entries(frameworkVendorExports || frameworkVendorExportsDefault).reduce(
    (acc, x) => Object.assign(acc, {
      [x[0]]: {
        commonjs: x[0],
        commonjs2: x[0],
        amd: x[0],
        root: [frameworkVarName, x[1]], // indicates global variable
      },
    }), {
      [frameworkPkgName]: {
        commonjs: frameworkPkgName,
        commonjs2: frameworkPkgName,
        amd: frameworkPkgName,
        root: frameworkVarName,
      },
    },
  );
}

function getSplitChunksOptions() {
  return {
    cacheGroups: {
      'vendor-polyfill': {
        test: /[\\/]node_modules[\\/](core-js|object-assign|promise|raf|regenerator-runtime|whatwg-fetch)[\\/]/,
        name: 'vendor-polyfill',
        chunks: 'all',
      },
      'vendor-react': {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
        name: 'vendor-react',
        chunks: 'all',
      },
      'vendor-redux': {
        test: /[\\/]node_modules[\\/](redux|react-redux|redux-thunk|redux-saga|redux-observable|rxjs)[\\/]/,
        name: 'vendor-redux',
        chunks: 'all',
      },
    },
  };
}

function webpackConfigCallback(config) {
  const newConfig = {
    ...config,
    optimization: {
      ...config.optimization,
      splitChunks: (process.env.SPLIT_CHUNKS !== 'false') && getSplitChunksOptions(),
    },
  };
  return newConfig;
}

module.exports = {
  getExternalsOptions,
  getSplitChunksOptions,
  webpackConfigCallback,
};
