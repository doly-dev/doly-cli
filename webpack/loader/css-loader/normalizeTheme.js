const { existsSync } = require('fs');
const { resolve, isAbsolute } = require('path');

module.exports = function (theme, opts = {}) {
  const { cwd = process.cwd() } = opts;
  if (!theme) return {};
  if (typeof theme === 'string') {
    const themePath = isAbsolute(theme) ? theme : resolve(cwd, theme);
    if (existsSync(themePath)) {
      const themeConfig = require(themePath);
      if (typeof themeConfig === 'function') {
        return themeConfig();
      } else {
        return themeConfig;
      }
    } else {
      throw new Error(`theme file don't exists`);
    }
  }
  return theme;
};
