/**
 * ref: 
 * https://github.com/sorrycc/roadhog/blob/master/src/utils/getEntry.js
 */

const { join, basename, sep, resolve } = require('path');
const { existsSync } = require('fs');
const glob = require('glob');
const isPlainObject = require('is-plain-object');

const webpackHotDevClientPath = require.resolve('react-dev-utils/webpackHotDevClient');

// entry 支持 4 种格式：
//
// 1. 什么都没配，取 src/index.(j|t)sx?
// 2. 对象
// 3. 字符串
// 4. 数组
function getConfigEntry({ 
  cwd = process.cwd(), 
  entry,
  isBuild=true
} = {}) {
  let entryObj = null;
  if (!entry) {
    entryObj = {
      index: getExistsDefaultEntry(cwd),
    };
  } else if (typeof entry === 'string') {
    const files = getFiles(entry, cwd);
    entryObj = getEntries(files);
  } else if (Array.isArray(entry)) {
    const files = entry.reduce((memo, entryItem) => {
      return memo.concat(getFiles(entryItem, cwd));
    }, []);
    entryObj = getEntries(files);
  } else if (isPlainObject(entry)) {
    entryObj = entry;
  } else {
    throw new Error(
      `entry should be String, Array or Plain Object, but got ${entry}`,
    );
  }

  if (!isBuild) {
    entryObj = Object.keys(entryObj).reduce(
      (memo, key) =>
        !Array.isArray(entryObj[key])
          ? {
              ...memo,
              [key]: [webpackHotDevClientPath, entryObj[key]],
            }
          : {
              ...memo,
              [key]: entryObj[key],
            },
      {},
    );
  }

  return entryObj;
}

function getEntry(filePath) {
  const key = basename(filePath).replace(/\.(j|t)sx?$/, '');
  return {
    [key]: filePath,
  };
}

function getFiles(entry, cwd) {
  const files = glob.sync(entry, {
    cwd,
  });
  return files.map(file => {
    // console.log('file, ', file);
    // return file.charAt(0) === '.' ? file : `.${sep}${file}`;
    return resolve(cwd, file);
  });
}

function getEntries(files) {
  return files.reduce((memo, file) => {
    return {
      ...memo,
      ...getEntry(file),
    };
  }, {});
}

function getExistsDefaultEntry(cwd) {
  if (existsSync(join(cwd, './src/app.js'))) {
    return './src/app.js';
  }
  if (existsSync(join(cwd, './src/app.jsx'))) {
    return './src/app.jsx';
  }
  // if (existsSync(join(cwd, './src/app.ts'))) {
  //   return './src/app.ts';
  // }
  // if (existsSync(join(cwd, './src/app.tsx'))) {
  //   return './src/app.tsx';
  // }
  // default
  return './src/app.js';
}

module.exports = getConfigEntry
