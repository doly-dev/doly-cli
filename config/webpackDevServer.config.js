const isPlainObject = require('is-plain-object');
const apiMocker = require('mocker-api');
const { existsSync } = require('fs');

module.exports = function ({
  config={}, 
  paths={}
}) {
  const { proxy: proxyConfig, mockFile } = config;
  const serverConfig = config.devServer;

  const defaultConfig = {
    contentBase: paths.appBuild,
    compress: true, // 启用gzip压缩
    // host: '127.0.0.1',
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
    historyApiFallback: true,
    overlay: true
  }

  if(existsSync(paths.resolveApp(mockFile))){
    defaultConfig.before = (app)=>{
      apiMocker(app, paths.resolveApp(mockFile), {
        proxy: proxyConfig || {}
      })
    }
  }

  // if(isPlainObject(proxyConfig)){
  //   if(existsSync(paths.resolveApp(mockFile))){
  //     console.warn('Mocker file does not exist!.');
  //   }else{
  //     defaultConfig.before = (app)=>{
  //       apiMocker(app, paths.resolveApp(mockFile), {
  //         proxy: proxyConfig
  //       })
  //     }
  //   }
  // }

  return Object.assign({}, defaultConfig, serverConfig);
}