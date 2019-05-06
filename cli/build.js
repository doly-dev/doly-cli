
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const chalk = require('chalk');
const isPlainObject = require('is-plain-object');
const { printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter');
const { success, info, error } = require('../utils/log');

const archiver = require('archiver');
const mkdirp = require('mkdirp');

const clearConsole = require('../utils/clearConsole');
const {webpackConfig, webpackDevServerConfig, paths, config: userConfig} = require('../webpack');

// const isInteractive = process.stdout.isTTY;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function build() {

  // console.log('building');

  // 删除构建文件
  rimraf.sync(paths.appBuild);

  const compiler = webpack(webpackConfig);

  compiler.run((err, stats)=>{

    // if(isInteractive){
    //   clearConsole();
    // }

    if (err || stats.hasErrors()) {
      // console.log('build failed!');
      if(err){
        error(err);
      }else if(stats.compilation && stats.compilation.errors && stats.compilation.errors.length > 0){
        error(stats.compilation.errors[0]);
      }
      
      process.exit(1);
      return;
    }
    // else{
    //   console.log('build done');
    // }

    info('File sizes after gzip:\n');
    printFileSizesAfterBuild(
      stats,
      {
        root: webpackConfig.output.path,
        sizes: {},
      },
      webpackConfig.output.path,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE,
    );
    console.log();

    // 标识配置了zip输出目录
    if(userConfig.zip && typeof userConfig.zip === 'string'){
      let { dir, ext, name } = path.parse(userConfig.zip);

      // ext = ext || '.zip';
      ext = '.zip'; // 强制写死
      name = name || 'build';

      // 相对与当前项目根目录的绝对路径
      let zipAbsPath = path.join(process.cwd(), dir);

      mkdirp(zipAbsPath, function (err) {
        if (err) error(err);
      });

      let output = fs.createWriteStream(zipAbsPath + '/' + name + ext);
      let archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      archive.pipe(output);

      archive.directory(userConfig.outputPath + '/', false);

      archive.finalize();

      console.log('Zip file: ' + chalk.yellow(zipAbsPath + '/' + name + ext));
      console.log();
    }

  });
}

module.exports = build;
