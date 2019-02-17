const chokidar = require('chokidar');

// 按 key 存，值为数组
const watchers = {};

function watch(key, files) {
  if (process.env.WATCH_FILES === 'none') return;
  if (!watchers[key]) {
    watchers[key] = [];
  }
  const watcher = chokidar.watch(files, {
    ignoreInitial: true,
  });
  watchers[key].push(watcher);
  return watcher;
}

function unwatch(key) {
  if (!key) {
    return Object.keys(watchers).forEach(unwatch);
  }
  if (watchers[key]) {
    watchers[key].forEach(watcher => {
      watcher.close();
    });
    delete watchers[key];
  }
}

module.exports = {
  watch,
  unwatch
}