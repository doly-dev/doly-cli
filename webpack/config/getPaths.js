const { resolve } = require('path');
const { realpathSync } = require('fs');

module.exports = function getPaths({
  cwd = process.cwd(),
  src = 'src',
  outputPath = 'dist',
  imageOutputPath = 'images'
  // zip = 'build'
} = {}) {
  const appDirectory = realpathSync(cwd);
  const resolveApp = (relativePath) => resolve(appDirectory, relativePath);
  const resolveOwn = (relativePath) => resolve(__dirname, '../..', relativePath);

  return {
    appBuild: resolveApp(outputPath),
    appBuildImage: resolveApp(imageOutputPath),
    // appBuildZip: resolveApp(zip),
    // appPublic: resolveApp('publicPath'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp(src),
    appNodeModules: resolveApp('node_modules'),
    ownNodeModules: resolveOwn('node_modules'),
    ownPackageJson: resolveOwn('package.json'),
    resolveApp,
    resolveOwn,
    appDirectory
  };
};
