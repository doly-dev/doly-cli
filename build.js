
const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const isPlainObject = require('is-plain-object');
const { printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter');

const clearConsole = require('./utils/clearConsole');
const {webpackConfig, webpackDevServerConfig, paths, config: userConfig} = require('./config');

const isInteractive = process.stdout.isTTY;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function build() {

  // console.log('building');

  // 删除zip打包文件夹
  if(isPlainObject(userConfig.zip) && userConfig.zip.path){
    rimraf.sync(path.resolve(paths.appBuild, userConfig.zip.path));
  }

  // 删除构建文件
  rimraf.sync(paths.appBuild);

  const compiler = webpack(webpackConfig);

  compiler.run((err, stats)=>{

    if(isInteractive){
      clearConsole();
    }

    if (err || stats.hasErrors()) {
      console.log('build failed!');
      if(err){
        console.error(err);
      }else if(stats.compilation && stats.compilation.errors && stats.compilation.errors.length > 0){
        console.error(stats.compilation.errors[0]);
      }
      
      process.exit(1);
      return;
    }
    // else{
    //   console.log('build done');
    // }

    console.log('File sizes after gzip:\n');
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

  });
}

module.exports = build;
