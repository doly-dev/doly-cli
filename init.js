'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const os = require('os');
const ora = require('ora');
const shell = require('shelljs');
const which = require('which');

const inquirer = require('inquirer');

const changeJsonfile = require('./utils/changeJsonfile');

const npms = ['tnpm', 'cnpm', 'npm'];

function findNpm() {
  for (let i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      // console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {

    }
  }
  throw new Error('please install npm');
}

function isDirectory(directoryName) {
  const stat = fs.statSync(directoryName);
  return stat.isDirectory();
}

function isEmptyDirectory(directoryName) {
  if(!isDirectory(directoryName)){
    console.error(`Folder does not exist.`);
    return;
  }

  const dirList = fs.readdirSync(directoryName);
  
  if(dirList.length === 0){
    return true;
  }else if(dirList.length === 1 && dirList[0].toLowerCase() === '.ds_store'){
    return true;
  }else{
    return false;
  }
}

function changePackageJsonName(appPath, appName) {
  return new Promise(resolve=>{
    const pkgFile = `${appPath}/package.json`;
    if(fs.existsSync(pkgFile) && appName){
      changeJsonfile(pkgFile, {
        name: appName 
      });
    }

    resolve();
  });
}

const scaffoldList = [
  {
    name: 'simple',
    description: 'Basic, simple and general.',
    templatePath: path.resolve(__dirname, 'templates/simple')
  },
  {
    name: 'mobx + wonder-ui',
    description: 'Mobx with wonder-ui, suitable for mobile.',
    templatePath: path.resolve(__dirname, 'templates/wonderui')
  },
  // {
  //   name: 'antd',
  //   templatePath: path.resolve(__dirname, 'templates/antd'),
  //   description: 'Suitable for mobile.'
  // },
  // {
  //   name: 'antd-mobile',
  //   templatePath: path.resolve(__dirname, 'templates/antd-mobile'),
  //   description: 'Suitable for mobile.'
  // }
];

module.exports = function(
  {
    appName,
    cwd = process.cwd()
  } = {}
) {

  // 项目目录
  let appPath = appName ? path.resolve(cwd, appName) : cwd;

  // 如果不存在该目录，则新建一个
  if(!fs.existsSync(appPath)){
    fs.mkdirSync(appPath);
  }

  // 如果该目录不是空目录，提示
  if(!isEmptyDirectory(appPath)){
    console.error('Folder is not empty. Please make empty Folder and inside that directory.');
    return;
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'scaffoldDesc',
        message: 'Which one do you want to use the scaffold?',
        // message: '请选择一个你要用的脚手架？',
        choices: scaffoldList.map(sca=>sca.description)
      }
    ])
    .then(answers => {
      const {templatePath} = scaffoldList.find(sca=>sca.description===answers.scaffoldDesc);

      if (templatePath || fs.existsSync(templatePath)) {

        fs.copySync(templatePath, appPath);

        changePackageJsonName(appPath, appName).then(()=>{
          const npm = findNpm();

          const spinnerInstall = ora(`${npm} installing...`);
          spinnerInstall.start();

          shell.exec(`cd ${appPath} && ${npm} install`, function () {
            console.log(chalk.green(npm + ' install end'));
            spinnerInstall.stop();

            console.log();
            console.log(`Success!`);
            console.log('Inside that directory, you can run several commands:');
            console.log();
            console.log(chalk.cyan(`  doly dev`));
            console.log('    Starts the development server.');
            console.log();
            console.log(chalk.cyan(`  doly build`));
            console.log('    Bundles the app into output files "dist" for production.');
            console.log();
          });
        })
      }else{
        console.log('Scaffold is undefined. Please contact author...');
        console.log('Author email: 369756941@qq.com');
      }

    });
};

