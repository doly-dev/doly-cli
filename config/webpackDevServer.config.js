const isPlainObject = require('is-plain-object');
const { existsSync } = require('fs');

const apiMocker = require('../mocker-api');

module.exports = function ({
  config={}, 
  paths={}
}) {
  const { proxy, mockFile, devServer } = config;

  const defaultConfig = {
    contentBase: paths.appBuild,
    compress: true, // 启用gzip压缩
    host: '0.0.0.0',
    port: 9000, // 端口
    open: true, // 自动打开浏览器
    disableHostCheck: true,
    compress: true,
    clientLogLevel: 'none',
    hot: true,
    quiet: true,
    headers: {
      'access-control-allow-origin': '*',
    },
    publicPath: config.publicPath,
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: false,
    overlay: true,
    proxy
  }

  if(existsSync(paths.resolveApp(mockFile))){
    defaultConfig.before = (app)=>{
      apiMocker(app, paths.resolveApp(mockFile));
    }
  }

  return Object.assign({}, defaultConfig, devServer);
}