#!/usr/bin/env node

const pkg = require('../package.json');
const program = require('commander');
const run = require('create-doly').run;
const list = require('create-doly').list;

program
  .version(pkg.version, '-v, --version')
  .description('run setup commands for all envs');

program
  .command('init [projectName]')
  .alias('i')
  .description('初始化项目脚手架')
  .action(function (projectName, options) {
    run();
  });

program
    .command('list [projectName]')
    .alias('i')
    .description('初始化项目脚手架')
    .action(function (projectName, options) {
      list();
    });

program
  .command('dev [env]')
  .description('开发。代码编译并启动本地服务，默认 development 环境')
  .action(function (env, options) {
    process.env.NODE_ENV = env || 'development';
    process.env.COMMANDER = 'dev';
    
    require('../cli/dev')();
  });

program
  .command('build [env]')
  .description('打包。默认 production 环境')
  .action(function (env, options) {
    process.env.NODE_ENV = env || 'production';
    process.env.COMMANDER = 'build';

    require('../cli/build')();
  });
 
program.parse(process.argv);

