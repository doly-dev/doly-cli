const { existsSync } = require('fs');

const apiMocker = require('doly-mocker-api');
const devStatus = require('../utils/dev-status');

const noMock = process.env.MOCK === 'none';

module.exports = function getWebpackDevServerConfig({
  config={}, 
  paths={}
}) {
  const { proxy, mockFile, devServer } = config;

  const defaultConfig = {
    compress: true, // 启用gzip压缩
    host: '0.0.0.0',
    port: 9000, // 端口
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

  if(existsSync(paths.resolveApp(mockFile)) && !noMock){
    defaultConfig.before = (app)=>{
      apiMocker(app, paths.resolveApp(mockFile),{
        showFileAddLog: ()=>{
          return !devStatus.isFirstCompile && !devStatus.isRestart;
        }
      });
    }
  }

  return Object.assign({}, defaultConfig, devServer);
}