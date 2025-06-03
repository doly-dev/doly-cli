/**
 * ref:
 *    https://github.com/jian263994241/module-hot-accept-loader
 */
const _ = require('lodash');

const getEntry = (entry) => {
  if (typeof entry === 'function') {
    return () => Promise.resolve(entry()).then(getEntry);
  }

  if (typeof entry === 'object' && !Array.isArray(entry)) {
    return () => Promise.resolve(_.flattenDeep(_.values(entry)));
  }

  return () => Promise.resolve(entry);
};

const injectText = (source) => {
  if (/\bmodule.hot\b/.test(source)) {
    return source;
  }
  return `
${source}
if(module.hot){
  module.hot.accept()
}
`;
};

module.exports = function (source, map, meta) {
  if (this.cacheable) {
    this.cacheable();
  }

  this.async();

  const rawRequest = this._module.rawRequest;

  getEntry(this._compiler.options.entry)().then((entry) => {
    if (_.includes(entry, rawRequest)) {
      source = injectText(source);
    }
    this.callback(null, source, map, meta);
  });
};
