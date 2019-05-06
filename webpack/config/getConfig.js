const { existsSync } = require('fs');
const { resolve } = require('path');

const defaultConfig = require('./default.config');

const getUserConfig = require('./getUserConfig');

/**
 * 获取配置
 * @param  {Object} opts       [description]
 * @return {[type]}            [description]
 */
function getConfig() {
  const env = process.env.NODE_ENV || 'development';

  const {env: envConfig, ...userConfig} = getUserConfig();

  const userEnvConfig = (envConfig && envConfig[env]) || {};
// console.log('env: ', env);
// console.log('envConfig: ', envConfig);
// console.log('userEnvConfig: ', userEnvConfig);
  return Object.assign({}, defaultConfig, userConfig, userEnvConfig);
}

module.exports = getConfig;