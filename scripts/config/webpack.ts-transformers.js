// webpack.ts-transformers.js
const { createPolyfillsTransformerFactory } = require('typescript-polyfills-generator');

const getCustomTransformers = () => ({
  before: [
    createPolyfillsTransformerFactory(),
  ],
});

module.exports = getCustomTransformers;
