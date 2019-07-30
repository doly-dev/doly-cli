const webpack = require('webpack');

const { existsSync } = require('fs');
const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const isPlainObject = require('is-plain-object');
const chalk = require('chalk');

module.exports = function (opts) {
  const {
    hash,
    cssInline,
    ignoreMomentLocale,
    copy,
    define,
    manifest,
    html,
    css={},

    devServer,
    paths
  } = opts;

  const hot = !devServer || typeof devServer.hot === 'undefined' || devServer.hot;
  const isDev = process.env.COMMANDER ==='dev';
  const hmr = hot && isDev;

  let plugins = [];

  // HtmlWebpackPlugin
  const htmls = !Array.isArray(html) ? [html] : html;
  const defaultHtml = resolve('./default.html');

  // 默认html
  // if(htmls.length <= 0){
  //   htmls.push({
  //     filename: 'index.html',
  //     template: defaultHtml
  //   });
  // }

  htmls.forEach(htmlItem=>{
    plugins.push(new HtmlWebpackPlugin({
      ...htmlItem,
      template: htmlItem.template ? paths.resolveApp(htmlItem.template) : defaultHtml
    }))
  })

  // MiniCssExtractPlugin
  if(!cssInline){
    let hashText = hash && !isDev ? '.[contenthash:8]' : '';
    let cssFilename = (css.filename && typeof css.filename === 'string') ? css.filename : '';
    let cssChunkFilename = (css.chunkFilename && typeof css.chunkFilename === 'string') ? css.chunkFilename : '';

    if(!cssFilename){
      cssFilename = `[name]${hashText}.css`;
    }

    if(!cssChunkFilename){
      cssChunkFilename = `[name]${hashText}.chunk.css`;
    }

    plugins.push(new MiniCssExtractPlugin(Object.assign({}, css, {
      filename: cssFilename,
      chunkFilename: cssChunkFilename
    })));
  }

  // webpack.DefinePlugin
  if(isPlainObject(define)){
    let defines = {};
    for(let prop in define){
      defines[prop] = JSON.stringify(define[prop]);
    }
    plugins.push(new webpack.DefinePlugin(defines))
  }

  // ManifestPlugin
  if(isPlainObject(manifest)){
    plugins.push(new ManifestPlugin(manifest));
  }

  // webpack.IgnorePlugin
  if(ignoreMomentLocale){
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  }

  // CopyWebpackPlugin
  let copyRet = [];

  // public目录，自动添加 copy
  if(existsSync(paths.resolveApp('public'))){
    copyRet.push({
      from: paths.resolveApp('public'),
      to: paths.appBuild,
      toType: 'dir'
    });
  }

  if(copy){
    if(isPlainObject(copy)){
      copy = [copy];
    }

    if(Array.isArray(copy)){
      copy.forEach(copyItem=>{
        const { from: copyFrom, to, ...copyItemRest } = copyItem;
        copyRet.push({
          from: paths.resolveApp(copyFrom),
          to: paths.resolveApp(to),
          ...copyItemRest
        });
      });
    }
  }

  if(copyRet.length > 0){
    plugins.push(new CopyWebpackPlugin(copyRet));
  }

  // ProgressBar
  if (process.platform === 'win32') {
    plugins.push(new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: true
    }));
  } else {
    plugins.push(new WebpackBar());
  }

  // HotModuleReplacementPlugin
  if(hmr){
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return plugins;
}
