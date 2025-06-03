const { existsSync } = require('fs');
const { resolve } = require('path');

const { CONFIGFILE } = require('./contants');

/**
 * 获取用户配置
 * @param  {Object} opts       [description]
 * @return {[type]}            [description]
 */
module.exports = function getUserConfig(opts = {}) {
  const { cwd = process.cwd(), configFile = CONFIGFILE } = opts;

  // 配置文件
  const rcFile = resolve(cwd, configFile);

  // 用户配置
  let userConfig = {};

  // 如果存在用户配置，获取用户配置项
  if (existsSync(rcFile)) {
    userConfig = require(rcFile);
    // console.log('rc ', userConfig);
  }

  return userConfig;
};
