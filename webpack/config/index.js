const getConfig = require('./getConfig');
const getPaths = require('./getPaths');
const { USER_CONFIGS, CONFIGFILE } = require('./contants');
const { watch, unwatch } = require('../../utils/watch');

let config = null;
let paths = null;

function loadConfig() {
  config = getConfig();
  paths = getPaths({
    src: config.context || 'src',
    outputPath: config.outputPath,
    imageOutputPath: config.image && config.image.outputPath
  });
}

function reloadConfig() {
  loadConfig();
}

function watchConfigs({ configFile = CONFIGFILE, ...opts } = {}) {
  // 配置文件
  const rcFile = paths.resolveApp(configFile);

  return watch(USER_CONFIGS, [rcFile]);
}

function unwatchConfigs() {
  unwatch(USER_CONFIGS);
}

loadConfig();

module.exports = {
  config,
  paths,
  reloadConfig,
  watchConfigs,
  unwatchConfigs
};
