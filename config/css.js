const { extname } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const normalizeTheme = require('./normalizeTheme');

module.exports = function (config={}, paths={}) {

  const isDevWithServer = process.env.COMMANDER ==='dev';

  const theme = normalizeTheme(config.theme);

  const cssOptions = {
    importLoaders: 1,
    sourceMap: !config.disableCSSSourceMap,
    ...(config.cssLoaderOptions || {}),
  }

  const cssModulesConfig = {
    modules: true,
    localIdentName: cssOptions.localIdentName || '[name]_[local]_[hash:base64:5]',
  }

  function createCSSLoader(cssModules) {
    return {
      loader: 'css-loader',
      options: {
        ...cssOptions,
        ...(cssModules ? cssModulesConfig : {}),
      }
    };
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: !config.disableCSSSourceMap,
      plugins: [
        require('postcss-flexbugs-fixes'), // eslint-disable-line
        require('autoprefixer')({browsers: config.browserslist, flexbox: 'no-2009'}),
        ...(config.extraPostCSSPlugins ? config.extraPostCSSPlugins : []),
      ]
    }
  }

  const lessLoader = {
    loader: 'less-loader',
    options: {
      modifyVars: theme,
      javascriptEnabled: true,
      sourceMap: !config.disableCSSSourceMap,
      ...(config.lessLoaderOptions || {}),
    }
  }

  function cssExclude(filePath) {
    if (/node_modules/.test(filePath)) {
      return true;
    }
    if (config.cssModulesWithAffix) {
      if (/\.module\.(css|less)$/.test(filePath)) return true;
    }
    if (config.cssModulesExcludes) {
      for (const exclude of config.cssModulesExcludes) {
        // if (filePath.indexOf(exclude) > -1) return true;
        if (exclude instanceof RegExp) {
          return exclude.test(filePath);
        } else {
          return filePath.indexOf(exclude) > -1;
        }
      }
    }
    return false;
  }

  const cssRule = {
    test: /\.css$/,
    use: [
      createCSSLoader(!config.disableCSSModules),
      postcssLoader
    ],
    exclude: cssExclude
  };

  const lessRule = {
    test: /\.less$/,
    use: [
      createCSSLoader(!config.disableCSSModules),
      postcssLoader,
      lessLoader
    ],
    exclude: cssExclude
  };

  const cssInNodeModulesRule = {
    test: /\.css$/,
    use: [
      createCSSLoader(false),
      postcssLoader
    ],
    include: paths.appNodeModules
  };

  const lessInNodeModulesRule = {
    test: /\.less$/,
    use: [
      createCSSLoader(false),
      postcssLoader,
      lessLoader
    ],
    include: paths.appNodeModules
  };

  // 固定名称模块
  const affixCssModulesRules = [];

  if (config.cssModulesWithAffix) {
    affixCssModulesRules.push({
      test: /\.module\.css$/,
      use: [
        createCSSLoader(true),
        postcssLoader
      ]
    });

    affixCssModulesRules.push({
      test: /\.module\.less$/,
      use: [
        createCSSLoader(true),
        postcssLoader,
        lessLoader
      ]
    });
  }

  // 过滤cssModules的规则
  const cssModulesExcludesRules = [];

  if(config.cssModulesExcludes){
    
    function cssModulesExcludesTest(exclude) {
      return function (filePath) {
        if (exclude instanceof RegExp) {
          return exclude.test(filePath);
        } else {
          return filePath.indexOf(exclude) > -1;
        }
      }
    }

    config.cssModulesExcludes.forEach((exclude, index) => {

      const ext = extname(exclude).toLowerCase();

      const innerLoader = [
        createCSSLoader(false),
        postcssLoader,
      ];

      if(ext === '.less'){
        innerLoader.push(lessLoader);
      }

      cssModulesExcludesRules.push({
        test: cssModulesExcludesTest(exclude),
        use: innerLoader
      })
    });
  }

  return [cssRule, lessRule, cssInNodeModulesRule, lessInNodeModulesRule, ...affixCssModulesRules, ...cssModulesExcludesRules].map(rule=>{
    if(config.cssInline){
      rule.use.unshift('style-loader');
    }else{
      rule.use.unshift(MiniCssExtractPlugin.loader);

      if(isDevWithServer){
        rule.use.unshift({
          loader: 'css-hot-loader',
          options: {
            reloadAll: true,
          }
        });
      }
    }

    return rule;
  });
}