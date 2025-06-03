const defaultConfig = require('./default.config');
const getUserConfig = require('./getUserConfig');

/**
 * 获取配置
 * @param  {Object} opts       [description]
 * @return {[type]}            [description]
 */
function getConfig() {
  const env = process.env.NODE_ENV || 'development';

  const { env: envConfig, ...userConfig } = getUserConfig();

  const userEnvConfig = (envConfig && envConfig[env]) || {};
  // console.log('env: ', env);
  // console.log('envConfig: ', envConfig);
  // console.log('userEnvConfig: ', userEnvConfig);

  const config = Object.assign({}, defaultConfig, userConfig, userEnvConfig);

  // 支持设置mode为production
  if (config.mode === 'production') {
    process.env.NODE_ENV = 'production';
    config.devtool = userEnvConfig.devtool || userConfig.devtool || undefined;
  }

  return config;
}

module.exports = getConfig;
