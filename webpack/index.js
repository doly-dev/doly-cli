const { config, paths, watchConfigs, unwatchConfigs } = require('./config');

const getWebpackConfig = require('./webpack.config');
const getWebpackDevServerConfig = require('./webpackDevServer.config');

let webpackConfig = null;
let webpackDevServerConfig = null;

webpackConfig = getWebpackConfig({
  config, paths
});

webpackDevServerConfig = getWebpackDevServerConfig({
  config, paths
});

module.exports = {
  config,
  paths,
  webpackConfig,
  webpackDevServerConfig,
  watchConfigs,
  unwatchConfigs
}