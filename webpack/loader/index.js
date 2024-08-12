const babelPreset = require('../../babel-preset');
const cssLoader = require('./css-loader');

module.exports = function (opts) {
  const {
    extraBabelPresets: extraPresets,
    extraBabelPlugins: extraPlugins,
    browserslist: browsers,
    replace,
    image,
    devServer,
    paths,
    transpileDependencies = [],
    ...restOpts
  } = opts;

  const hot =
    !devServer || typeof devServer.hot === 'undefined' || devServer.hot;
  const isDev = process.env.COMMANDER === 'dev';
  const hmr = hot && isDev;

  const jsRule = {
    test: /\.jsx?$/,
    include: [paths.appSrc, ...transpileDependencies],
    enforce: 'pre',
    use: [
      {
        loader: 'babel-loader',
        options: {
          customize: paths.resolveOwn('utils/webpack-overrides'),
          ...babelPreset({
            extraPresets,
            extraPlugins,
            browsers,
          }),
        },
      },
    ],
  };

  const tsRule = {
    test: /\.tsx?$/,
    include: [paths.appSrc, ...transpileDependencies],
    enforce: 'pre',
    use: [
      {
        loader: 'babel-loader',
        options: {
          customize: paths.resolveOwn('utils/webpack-overrides'),
          ...babelPreset({
            extraPresets,
            extraPlugins,
            browsers,
            typescript: true,
          }),
        },
      },
    ],
  };

  if (replace) {
    jsRule.use.push({
      loader: 'string-replace-loader',
      options: replace,
    });

    tsRule.use.push({
      loader: 'string-replace-loader',
      options: replace,
    });
  }

  const cssRules = cssLoader({
    ...restOpts,
    hmr,
    browsers,
  });

  const imgRule = {
    test: /\.(jpe?g|png|gif|svg|eot|ttf|woff)$/i,
    include: paths.appSrc,
    use: [
      {
        loader: 'url-loader',
        options: image,
      },
    ],
  };

  const htmlRule = {
    test: /\.(html)$/,
    use: {
      loader: 'html-loader',
      options: {
        // attrs: ['img:src']
      },
    },
  };

  const rules = [jsRule, tsRule, ...cssRules, imgRule, htmlRule];

  // 默认在entry中插入 模块热替换 代码
  if (hmr) {
    rules.push({
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      enforce: 'post',
      use: [{ loader: paths.resolveOwn('utils/hmr-loader') }],
    });
    rules.push({
      test: /\.tsx?$/,
      exclude: /(node_modules|bower_components)/,
      enforce: 'post',
      use: [{ loader: paths.resolveOwn('utils/hmr-loader') }],
    });
  }

  return rules;
};
