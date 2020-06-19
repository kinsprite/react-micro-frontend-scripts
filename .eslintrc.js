const allExtensions = ['.js', 'json'];

module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages', {
        js: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-dynamic-require': 'off',
    'no-console': 'off',
    'global-require': 'off',
    'no-nested-ternary': 'off',
  },
  settings: {
    'import/extensions': allExtensions,
    'import/resolver': {
      node: {
        extensions: allExtensions,
      },
    },
  },
};
