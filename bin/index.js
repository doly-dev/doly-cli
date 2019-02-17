#!/usr/bin/env node

const pkg = require('../package.json');
const program = require('commander');

program
  .version(pkg.version, '-v, --version')
  .description('run setup commands for all envs')
  // .usage('init|i')
  // .usage('dev [options]')
  // .usage('build [options]')
  // .option('-C, --chdir <path>', 'change the working directory')
  // .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  // .option('-T, --no-tests', 'ignore test hook');

program
  // .command('init [projectName]')
  .command('init [projectName]')
  .alias('i')
  .description('初始化项目脚手架')
  .action(function (projectName, options) {
    require('../init')({appName: projectName});
  });

program
  .command('dev [env]')
  .description('开发。代码编译并启动本地服务，默认 development 环境')
  .action(function (env, options) {
    process.env.NODE_ENV = env || 'development';
    process.env.COMMANDER = 'dev';
    
    require('../dev')();
  });

program
  .command('build [env]')
  .description('打包。默认 production 环境')
  .action(function (env, options) {
    process.env.NODE_ENV = env || 'production';
    process.env.COMMANDER = 'build';

    require('../build')();
  });
 
program.parse(process.argv);

