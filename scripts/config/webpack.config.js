const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

const postcssNormalize = require('postcss-normalize');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const paths = require('./paths');
const pkgJson = require('../internal/pkgJson');
const getPublicUrlOrPath = require('../internal/getPublicUrlOrPath');
const getGitTagOrShort = require('../internal/getGitTagOrShort');

const cssRegex = /\.p?css$/;
const cssModuleRegex = /\.module\.p?css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// (env: string) => {}
module.exports = (env) => {
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';

  const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');
  const isPreact = process.env.PREACT_MOBILE === 'true';

  // Source maps are resource heavy and can cause out of memory issue for large source files.
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  // Some apps do not need the benefits of saving a web request, so not inlining the chunk
  // makes for a smoother build process.
  const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
  // Minimize files in production
  const shouldMinimizeInProduction = process.env.MINIMIZE_IN_PRODUCTION !== 'false';

  const shouldGenerateIndexHTML = !isEnvProduction || process.env.GENERATE_INDEX_HTML === 'true';
  const shouldWorkboxGenerateSW = isEnvProduction && process.env.WORKBOX_GENERATE_SW === 'true';
  const shouldWorkboxInjectManifest = isEnvProduction && process.env.WORKBOX_INJECT_MANIFEST === 'true';

  const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10,
  );

  const postcssPresetEnvStage = parseInt(
    process.env.POSTCSS_PRESET_ENV_STAGE || '3', 10,
  );

  const shouldSplitChunks = process.env.SPLIT_CHUNKS !== 'false';
  const shouldRuntimeChunk = process.env.RUNTIME_CHUNK !== 'false';

  const mainEntryName = pkgJson.getMainEntryName();

  const webpackEntry = {
    [mainEntryName]: paths.mainEntry(),
  };

  const manifestFileName = `${pkgJson.getReactMicroFrontendShort()}-manifest.json`;

  const gitRev = getGitTagOrShort();
  const publicUrlOrPath = getPublicUrlOrPath(isEnvDevelopment);
  const libraryName = process.env.ENSURE_NO_EXPORTS === 'true' ? '' : pkgJson.getLibraryName();

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: postcssPresetEnvStage,
            }),
            postcssNormalize(),
          ],
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        },
      );
    }

    return loaders;
  };

  return {
    mode: (isEnvProduction && 'production') || (isEnvDevelopment && 'development') || 'none',
    devtool: isEnvProduction
      ? (shouldUseSourceMap
        ? 'source-map'
        : false)
      : isEnvDevelopment && 'cheap-module-source-map',
    entry: webpackEntry,
    plugins: [
      (isEnvProduction || (isEnvDevelopment && process.env.DISABLE_DEV_SERVER === 'true')) && new CleanWebpackPlugin(),
      shouldGenerateIndexHTML && new HtmlWebpackPlugin({ template: paths.template() }),
      isEnvProduction && shouldInlineRuntimeChunk
        && shouldGenerateIndexHTML && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      new ModuleNotFoundPlugin(paths.appRoot()),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.nodeModules()),
      new DuplicatePackageCheckerPlugin(),
      new ManifestPlugin({
        fileName: manifestFileName,
        publicPath: publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path; // eslint-disable-line no-param-reassign
            return manifest;
          }, seed);

          const entrypointFiles = Object.keys(entrypoints).reduce((acc, key) => acc.concat(
            entrypoints[key].filter((fileName) => !fileName.endsWith('.map')).map((fileName) => {
              // add publicUrlOrPath to file
              if (publicUrlOrPath && !fileName.startsWith(publicUrlOrPath)) {
                return publicUrlOrPath + fileName;
              }

              return fileName;
            }),
          ), []);

          return {
            entrypoints: entrypointFiles,
            files: manifestFiles,
            gitRevision: gitRev,
            libraryExport: libraryName,
            publicPath: publicUrlOrPath,
            serviceName: mainEntryName,
            ...pkgJson.getRmfManifest(),
          };
        },
      }),
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the webpack build.
      shouldWorkboxGenerateSW
        && new WorkboxWebpackPlugin.GenerateSW({
          clientsClaim: true,
          exclude: [/index\.html$/, /\.map$/, /asset-manifest\.json$/, /rmf-manifest\.json$/, /\.LICENSE\.txt$/],
          navigateFallback: `${publicUrlOrPath}index.html`,
          navigateFallbackDenylist: [
            // Exclude URLs starting with /_, as they're likely an API call
            new RegExp('^/_'),
            new RegExp('^/api'),
            // Exclude any URLs whose last part seems to be a file extension
            // as they're likely a resource and not a SPA route.
            // URLs containing a "?" character won't be blacklisted as they're likely
            // a route with query params (e.g. auth callbacks).
            new RegExp('/[^/?]+\\.[^/]+$'),
          ],
          skipWaiting: true,
        }),
      shouldWorkboxInjectManifest
         && new WorkboxWebpackPlugin.InjectManifest({
           swSrc: paths.swSrc(),
           exclude: [/\.map$/, /asset-manifest\.json$/, /rmf-manifest\.json$/, /\.LICENSE\.txt$/],
         }),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          enabled: isEnvDevelopment,
          files: './src/**/*.@(tsx|ts|jsx|js)',
        },
      }),
      isEnvProduction && new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css',
      }),
    ].filter(Boolean),
    module: {
      rules: [{
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: imageInlineSizeLimit,
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: [
                    ['@babel/preset-env'],
                    isPreact ? ['@babel/preset-react', {
                      pragma: 'h',
                      pragmaFrag: 'Fragment',
                    }] : ['@babel/preset-react'],
                    ['@babel/preset-typescript'],
                  ],
                  plugins: ['@babel/plugin-transform-runtime'],
                  // This is a feature of `babel-loader` for webpack (not Babel itself).
                  // It enables caching results in ./node_modules/.cache/babel-loader/
                  // directory for faster rebuilds.
                  cacheDirectory: true,
                  // See #6846 for context on why cacheCompression is disabled
                  cacheCompression: false,
                  compact: isEnvProduction,
                },
              },
            ],
          },
          // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
          // using the extension .module.css
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isEnvProduction && shouldUseSourceMap,
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            }),
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isEnvProduction && shouldUseSourceMap,
            }),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: isEnvProduction && shouldUseSourceMap,
              },
              'sass-loader',
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: isEnvProduction && shouldUseSourceMap,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              'sass-loader',
            ),
          },
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        ], // oneOf
      }], // rules
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      plugins: [
        PnpWebpackPlugin,
        // Prevents users from importing files from outside of src/ (or node_modules/).
        new ModuleScopePlugin(paths.src(), [paths.pkgJson()]),
      ],
    },
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    output: {
      path: (isEnvProduction && paths.prodDist())
      || (isEnvDevelopment && (process.env.DISABLE_DEV_SERVER === 'true') && paths.devTmp()) || undefined,
      publicPath: publicUrlOrPath,
      filename: (isEnvProduction && '[name].[contenthash:8].js') || (isEnvDevelopment && '[name].js'),
      chunkFilename: (isEnvProduction && '[name].[contenthash:8].chunk.js') || (isEnvDevelopment && '[name].chunk.js'),
      library: libraryName || undefined,
      libraryTarget: 'umd',
      // Prevents conflicts when multiple webpack runtimes (from different apps)
      // are used on the same page.
      jsonpFunction: `webpackJsonp${pkgJson.getLibraryName()}`,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    optimization: {
      minimize: isEnvProduction && shouldMinimizeInProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: shouldUseSourceMap,
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                inline: false,
                annotation: true,
              }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      // Long term caching
      moduleIds: isEnvProduction ? 'hashed' : false,
      // Automatically split vendor and commons
      splitChunks: shouldSplitChunks && {
        chunks: 'all',
        name: false,
      },
      // Keep the runtime chunk separated to enable long term caching
      runtimeChunk: shouldRuntimeChunk && {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
  };
};
