const loader = require('./loader');
const plugins = require('./plugins');
const getOptimization = require('./optimization');

const getEntry = require('./entry');

module.exports = function getWebpackConfig({
  config={}, 
  paths={}
}) {
  const {
    entry,
    publicPath,
    optimization,
    devServer,
    hash,
    outputFilename,
    outputChunkFilename,
    externals,
    extensions,
    alias,
    devtool,
    terserOptions
  } = config;

  const isDevWithServer = process.env.COMMANDER ==='dev';
  const isProd = process.env.NODE_ENV === 'production';
  const mode = isProd ? 'production' : 'development';
  
  // 开启模块热替换。如果要兼容IE9/10/11，需关闭模块热替换。由于模块热替换代码[react-dev-utils/webpackHotDevClient]没有进行编译，含有箭头函数等语法
  const hot = !devServer || typeof devServer.hot === 'undefined' || devServer.hot;

  // 热更新(HMR)不能和[chunkhash]同时使用。
  const jsFileHash = hash && !isDevWithServer ? '.[chunkhash:8]':'';

  let jsFilename = outputFilename ? outputFilename : `[name]${jsFileHash}.js`;
  let jsChunkFilename = outputChunkFilename ? outputChunkFilename : `[name]${jsFileHash}.chunk.js`;

  const rules = loader({
    ...config,
    paths
  })

  const webpackConfig =  {
    mode: config.mode || mode,
    entry: getEntry({entry, isBuild: !isDevWithServer, hot}),
    output: {
      path: paths.appBuild,
      publicPath: publicPath,
      filename: jsFilename,
      chunkFilename: jsChunkFilename
    },
    optimization: getOptimization({
      enabledMinimize: !isDevWithServer && isProd, 
      terserOptions,
      opts: optimization
    }),
    resolve: {
      // fix 设置绝对路径导致npm安装的多版本包索引不到的问题
      // ref: https://webpack.docschina.org/configuration/resolve/#resolve-modules
      // modules: [paths.appNodeModules, paths.ownNodeModules],
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
      rules: rules
    },
    plugins: plugins({
      ...config,
      paths
    }),
    devtool,
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

  if(externals){
    webpackConfig.externals = externals;
  }

  if(extensions){
    webpackConfig.resolve.extensions = webpackConfig.resolve.extensions.concat(extensions);
  }

  if(alias){
    webpackConfig.resolve.alias = alias;
  }

  return webpackConfig;
}
