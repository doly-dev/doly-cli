const getConfig = require('./getConfig');
const getPaths = require('./getPaths');
const { CONFIGFILE } = require('./contants');
const { watch, unwatch } = require('./watch');

const getWebpackConfig = require('./webpack.config');
const getWebpackDevServerConfig = require('./webpackDevServer.config');

let config = null;
let paths = null;
let webpackConfig = null;
let webpackDevServerConfig = null;

const USER_CONFIGS = 'USER_CONFIGS';

function reloadConfig() {
  config = getConfig();
// console.log('reload config ', config);
  paths = getPaths({
    src: config.context || 'src',
    outputPath: config.outputPath,
    imageOutputPath: config.image && config.image.outputPath
  });

  webpackConfig = getWebpackConfig({
    config, paths
  });

  webpackDevServerConfig = getWebpackDevServerConfig({
    config, paths
  });
}

reloadConfig();

function watchConfigs(opts = {}) {
  const { configFile = CONFIGFILE } = opts;

  // 配置文件
  const rcFile = paths.resolveApp(configFile);

  return watch(USER_CONFIGS, [rcFile]);
}

function unwatchConfigs() {
  unwatch(USER_CONFIGS);
}

module.exports = {
  config,
  paths,
  webpackConfig,
  webpackDevServerConfig,
  reloadConfig,
  watchConfigs,
  unwatchConfigs
}