const path = require('path');

const webpack = require('webpack');

const { existsSync } = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isPlainObject = require('is-plain-object');
const chalk = require('chalk');

const getConfigEntry = require('./getConfigEntry');
const cssRules = require('./css');

function getWebpackConfig({
  config={}, 
  paths={}
}) {
  const cwd = process.cwd();
  const isDevWithServer = process.env.COMMANDER ==='dev';
  const isProd = process.env.NODE_ENV === 'production';
  const mode = isProd ? 'production' : 'development';
  
  // 开启模块热替换。如果要兼容IE9/10/11，需关闭模块热替换。由于模块热替换代码[react-dev-utils/webpackHotDevClient]没有进行编译，含有箭头函数等语法
  const isEnabledHot = !config.devServer || typeof config.devServer.hot === 'undefined' || config.devServer.hot;

  // 默认优化项
  const defaultOptimization = {
    minimize: !isDevWithServer && isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: !isDevWithServer && isProd,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }

  const jsRule = {
    test: /\.(js|jsx)$/,
    exclude: /(node_modules|bower_components)/,
    enforce: 'pre',
    use:[
      {
        loader: 'babel-loader',
        options: {
          customize: paths.resolveOwn(
            'utils/webpack-overrides'
          ),
          presets: [
            [require.resolve("@babel/preset-env"), {
              targets: {
                "browsers": config.browserslist
              },
              exclude: ['transform-typeof-symbol'],
            }], 
            require.resolve("@babel/preset-react"),
            ...(config.extraBabelPresets || []),
          ],
          plugins: [
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            [
              require.resolve('@babel/plugin-proposal-object-rest-spread'),
              {
                useBuiltIns: true,
              },
            ],
            require.resolve('@babel/plugin-proposal-async-generator-functions'),

            // 下面两个的顺序的配置都不能动
            [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
            [
              require.resolve('@babel/plugin-proposal-class-properties'),
              { loose: true },
            ],

            require.resolve('@babel/plugin-proposal-export-namespace-from'),
            require.resolve('@babel/plugin-proposal-export-default-from'),

            require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
            require.resolve('@babel/plugin-proposal-optional-chaining'),
            [
              require.resolve('@babel/plugin-proposal-pipeline-operator'),
              {
                proposal: 'minimal',
              },
            ],

            require.resolve('@babel/plugin-proposal-do-expressions'),
            require.resolve('@babel/plugin-proposal-function-bind'),
            require.resolve('babel-plugin-macros'),

            ...(config.extraBabelPlugins || []),

            [
              require.resolve('babel-plugin-named-asset-import'),
              {
                loaderMap: {
                  svg: {
                    ReactComponent:
                      '@svgr/webpack?-prettier,-svgo![path]',
                  },
                },
              },
            ],
            [
              require.resolve('@babel/plugin-transform-runtime'),
              {
                // corejs: false,
                // helpers: areHelpersEnabled,
                // regenerator: true,
                // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                // We should turn this on once the lowest version of Node LTS
                // supports ES Modules.
                // useESModules,
                // Undocumented option that lets us encapsulate our runtime, ensuring
                // the correct version is used
                // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                absoluteRuntime: path.dirname(
                  require.resolve('@babel/runtime/package.json')
                )
              },
            ],
            // require.resolve('babel-plugin-dynamic-import-node')
          ]
        }
      },
      // 'eslint-loader'
    ],
    include: paths.appSrc
  };

  if(config.replace){
    jsRule.use.push({
      loader: 'webpack-replace-loader',
      options: config.replace
    });
  }

  // 启用eslint
  // if(config.eslint){
    // const eslintFile = existsSync(paths.resolveApp('.eslintrc')) ? paths.resolveApp('.eslintrc') : paths.resolveOwn('.exlintrc');
    // jsRule.use.push({
    //   loader: 'eslint-loader',
    //   options: {
    //     eslintPath: eslintFile
    //   }
    // });

    // const eslintFile = existsSync(paths.resolveApp('.eslintrc')) ? paths.resolveApp('.eslintrc') : paths.resolveOwn('.exlintrc');

    // plugins.push(new webpack.LoaderOptionsPlugin({
    //   options: {
    //     eslint: {
    //       configFile: eslintFile
    //     }
    //   }
    // }));
  // }

  const htmls = !Array.isArray(config.html) ? [config.html] : config.html;

  const commander = process.env.COMMANDER;

  const plugins = [];

  htmls.forEach(htmlConfig=>{
    plugins.push(new HtmlWebpackPlugin({
      ...htmlConfig,
      template: paths.resolveApp(htmlConfig.template)
    }))
  })

  if(!config.cssInline && !isDevWithServer){
    let hash = config.hash ? '.[contenthash:8]' : '';
    let css = config.css || {};
    let cssFilename = (css.filename && typeof css.filename === 'string') ? css.filename : '';
    let cssChunkFilename = (css.chunkFilename && typeof css.chunkFilename === 'string') ? css.chunkFilename : '';

    if(!cssFilename){
      cssFilename = `[name]${hash}.css`;
    }

    if(!cssChunkFilename){
      cssChunkFilename = `[name]${hash}.chunk.css`;
    }

    plugins.push(new MiniCssExtractPlugin(Object.assign({}, css, {
      filename: cssFilename,
      chunkFilename: cssChunkFilename
    })));
  }

  if(isPlainObject(config.define)){
    let defines = {};
    for(let prop in config.define){
      defines[prop] = JSON.stringify(config.define[prop]);
    }
    plugins.push(new webpack.DefinePlugin(defines))
  }

  if(isPlainObject(config.manifest)){
    plugins.push(new ManifestPlugin(config.manifest));
  }

  plugins.push(new ProgressBarPlugin({
    format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
    clear: true
  }));

  if(isDevWithServer && isEnabledHot){
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if(config.ignoreMomentLocale){
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  }

  let copyRet = [];

  if(existsSync(paths.resolveApp('public'))){
    copyRet.push({
      from: paths.resolveApp('public'),
      to: paths.appBuild,
      toType: 'dir'
    });
  }

  if(config.copy){
    let copy = null;
    if(Array.isArray(config.copy)){
      copy = config.copy;
    }else if(isPlainObject(config.copy)){
      copy = [config.copy];
    }

    copy.forEach(copyItem=>{
      const { from: copyFrom, to, ...copyItemRest } = copyItem;
      copyRet.push({
        from: paths.resolveApp(copyFrom),
        to: paths.resolveApp(to),
        ...copyItemRest
      });
    });
  }

  if(copyRet.length > 0){
    plugins.push(new CopyWebpackPlugin(copyRet));
  }

  const genOptimization = function (opts) {
    return Object.assign({}, defaultOptimization, isPlainObject(opts) ? opts : {});
  }

  // 热更新(HMR)不能和[chunkhash]同时使用。
  const jsFileHash = config.hash && !isDevWithServer ? '.[chunkhash:8]':'';

  let jsFilename = config.outputFilename ? config.outputFilename : `[name]${jsFileHash}.js`;
  let jsChunkFilename = config.outputChunkFilename ? config.outputChunkFilename : `[name]${jsFileHash}.chunk.js`;

  const webpackConfig =  {
    mode,
    entry: getConfigEntry({entry: config.entry, isBuild: !isDevWithServer, hot: isEnabledHot}),
    output: {
      path: paths.appBuild,
      publicPath: config.publicPath,
      filename: jsFilename,
      chunkFilename: jsChunkFilename
    },
    optimization: genOptimization(config.optimization),
    resolve: {
      modules: [paths.appNodeModules, paths.ownNodeModules],
      extensions: [
        'web.mjs',
        'mjs',
        'web.js',
        'js',
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'json',
        'web.jsx',
        'jsx',
      ].map(ext=>`.${ext}`)
    },
    resolveLoader: {
      moduleExtensions: [ '-loader' ],
      modules: [paths.appNodeModules, paths.ownNodeModules]
    },
    module: {
      rules: [
        ...cssRules(config, paths),
        {
          test: /\.(jpe?g|png|gif|svg|eot|ttf|woff)$/i,
          use: [
            {
              loader: 'url-loader',
              options: config.image
            }
          ],
          include: paths.appSrc
        },
        // {
        //   test: /\.(eot|ttf|woff|svg)$/,
        //   use: 'file-loader',
        //   include: paths.appSrc
        // },
        {
          test: /\.(htm|html)$/,
          use: 'html-withimg-loader',
          include: paths.appSrc
        },
        jsRule
      ]
    },
    plugins,
    devtool: config.devtool,
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  }

  if(config.externals){
    webpackConfig.externals = config.externals;
  }

  if(config.extensions){
    webpackConfig.extensions = webpackConfig.extensions.concat(config.extensions);
  }

  if(config.alias){
    webpackConfig.resolve.alias = config.alias;
  }

  return webpackConfig;
}

module.exports = getWebpackConfig;




