const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('./utils/clearConsole');
const choosePort = require('./utils/choosePort');

const prepareUrls = require('./utils/prepareUrls');
const { success, info, error } = require('./utils/log');

const isInteractive = process.stdout.isTTY;
const PROTOCOL = 'http';

let isRestart = false;
let isFirstCompile = true;
let cachePort = '';

// fix 端口号冲突的情况下，每次都走 choose port 问题
function wrapChoosePort(port) {
  return new Promise(resolve=>{
    if(isRestart && cachePort){
      resolve(cachePort);
    }else{
      choosePort(port).then(innerPort=>{
        resolve(innerPort);
      })
    }
  })
}

function dev() {

  const { webpackConfig, webpackDevServerConfig, watchConfigs, unwatchConfigs } = require('./config');
  const { port, host } = webpackDevServerConfig;

  wrapChoosePort(port).then(innerPort=>{
    if (innerPort === null) {
      return;
    }

    cachePort = innerPort;

    const compiler = webpack(webpackConfig);

    const urls = prepareUrls(PROTOCOL, host, innerPort);

    compiler.hooks.watchRun.tap('dev-server', ()=>{
      if(isInteractive && isFirstCompile && !isRestart){
        clearConsole();
      }

      if(isRestart){
        info(`Configuration changes, restart server...\n`);
      }else if(isFirstCompile){
        info('Starting the development server...\n');
      }
    });

    compiler.hooks.done.tap('doly dev', stats => {

      if (stats.hasErrors()) {
        // make sound
        // ref: https://github.com/JannesMeyer/system-bell-webpack-plugin/blob/bb35caf/SystemBellPlugin.js#L14
        if (process.env.SYSTEM_BELL !== 'none') {
          process.stdout.write('\x07');
        }
        
        if(stats.compilation && stats.compilation.errors && stats.compilation.errors.length > 0){
          error(stats.compilation.errors[0]);
        }

        return;
      }

      if (isFirstCompile && !isRestart) {
          console.log(
            [
              `  App running at:`,
              `  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`,
              `  - Network: ${chalk.cyan(urls.lanUrlForTerminal)}`,
            ].join('\n'),
          );
          console.log();
      }

      if(isFirstCompile || isRestart){
        openBrowser(urls.localUrlForBrowser);
      }

      if(isRestart){
        isRestart = false;
      }

      if (isFirstCompile) {
        isFirstCompile = false;
      }
    });

    const server = new WebpackDevServer(compiler, { ...webpackDevServerConfig, port: innerPort });

    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        server.close(() => {
          process.exit(0);
        });
      });
    });

    let configFailed = false;

    server.listen(innerPort, host, err => {
      if (err) {
        console.log(err);
        return;
      }

      afterServer();
    });

    function clearRequireCache() {
      Object.keys(require.cache).forEach(key=>{
        delete require.cache[key];
      })
    }

    function afterServer() {
      const watcher = watchConfigs();

      if (watcher) {
        watcher.on('all', () => {
          try {
            if(!isRestart){
              isRestart = true;
            }

            // 从失败中恢复过来，需要 reload 一次
            if (configFailed) {
              configFailed = false;
              server.sockWrite(server.sockets, 'content-changed');
            }else{
              server.close();
              unwatchConfigs();
              clearRequireCache();
              dev();
            }
          } catch (e) {
            configFailed = true;
            console.error(chalk.red(`Watch handler failed, since ${e.message}`));
            console.error(e);
          }
        });
      }
    }
  })
  .catch(err => {
    console.log(err);
  });
}

module.exports = dev;