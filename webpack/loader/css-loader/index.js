const { extname, resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const normalizeTheme = require('./normalizeTheme');

module.exports = function ({
  cwd = process.cwd(),
  theme,
  hmr=true,
  cssInline=false,
  disableCSSModules=false,
  disableCSSSourceMap=false,
  cssModulesWithAffix=true,
  cssModulesExcludes=[],
  cssLoaderOptions={},
  lessLoaderOptions={},
  extraPostCSSPlugins=[],
  browsers=['last 2 versions']
}) {

  const appNodeModulesPath = resolve(cwd, 'node_modules');

  theme = normalizeTheme(theme);

  const cssOptions = {
    importLoaders: 1,
    sourceMap: !disableCSSSourceMap,
    ...cssLoaderOptions,
  }

  const cssModulesConfig = {
    modules: {
      localIdentName: cssOptions.localIdentName || '[name]_[local]_[hash:base64:5]'
    }
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
      sourceMap: !disableCSSSourceMap,
      plugins: [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({overrideBrowserslist: browsers, flexbox: 'no-2009'}),
        ...extraPostCSSPlugins,
      ]
    }
  }

  const lessLoader = {
    loader: 'less-loader',
    options: {
      modifyVars: theme,
      javascriptEnabled: true,
      sourceMap: !disableCSSSourceMap,
      ...lessLoaderOptions,
    }
  }

  function cssExclude(filePath) {
    if (/node_modules/.test(filePath)) {
      return true;
    }
    if (cssModulesWithAffix) {
      if (/\.module\.(css|less)$/.test(filePath)) return true;
    }
    if (cssModulesExcludes) {
      for (const exclude of cssModulesExcludes) {
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
      createCSSLoader(!disableCSSModules),
      postcssLoader
    ],
    exclude: cssExclude
  };

  const lessRule = {
    test: /\.less$/,
    use: [
      createCSSLoader(!disableCSSModules),
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
    include: appNodeModulesPath
  };

  const lessInNodeModulesRule = {
    test: /\.less$/,
    use: [
      createCSSLoader(false),
      postcssLoader,
      lessLoader
    ],
    include: appNodeModulesPath
  };

  // 固定名称模块
  const affixCssModulesRules = [];

  if (cssModulesWithAffix) {
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

  if(cssModulesExcludes){
    
    function cssModulesExcludesTest(exclude) {
      return function (filePath) {
        if (exclude instanceof RegExp) {
          return exclude.test(filePath);
        } else {
          return filePath.indexOf(exclude) > -1;
        }
      }
    }

    cssModulesExcludes.forEach((exclude, index) => {

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
    if(cssInline){
      rule.use.unshift('style-loader');
    }else{
      rule.use.unshift({
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: hmr,
          reloadAll: true,
        }
      });
    }

    return rule;
  });
}