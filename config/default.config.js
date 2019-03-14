const isProd = process.env.NODE_ENV === 'production';

const defaultDevtool = isProd ? undefined : 'cheap-module-source-map';

module.exports = {
  // 指定 webpack 入口文件
  // 如果是多页面多入口，请使用对象模式，并配置 optimization的splitChunks
  entry: 'src/app.js',

  // 配置 webpack 的 output.publicPath 属性。
  outputPath: 'dist',
  
  // 配置构建完成后生成 `zip` 文件，相对于当前项目根目录
  // zip: 'build/project.zip',

  // 配置 webpack 的 output.filename 属性
  // outputFilename: 'res/j/[name].[hash].js',

  // 配置 webpack 的 output.publicPath 属性。
  publicPath: '/',

  // 配置让构建产物文件名带 hash，通常会和 manifest 配合使用。
  hash: true,

  // 忽略moment 的 locale 文件,用于减少尺寸
  ignoreMomentLocale: true,

  // 配置后会生成 manifest.json，option 传给 https://www.npmjs.com/package/webpack-manifest-plugin。
  // manifest: {
  //   "basePath": "/app/"
  // },

  // 多页面使用数组
  html: [{
    // title: '', // 页面标题
    template:'src/index.html', // 指定要打包的html路径和文件名
    filename: 'index.html', // 指定输出路径和文件名
    // chunks: [] // 引入需要的chunk
  }],

  // 图片url-loader 配置
  image: {
    outputPath: 'images', // 图片输出地址，默认 images
    name: '[name].[hash:8].[ext]', // 文件名
    limit: 1024*8 // 小于该大小的图片转为base64
  },

  // 配置 MiniCssExtractPlugin 。设置filename之后，hash配置无效，需自己配置hash。如果设置cssInline为true，该配置无效。
  // css: {
  //   filename: '[name].[contenthash:8].css',
  //   chunkFilename: '[name].[contenthash:8].chunk.css',
  // },

  // 样式打包到js中
  cssInline: true,
  // 禁用 CSS Modules。
  disableCSSModules: false,
  // 禁用 CSS 的 SourceMap 生成。
  disableCSSSourceMap: isProd,

  // js文本替换，兼容fis脚手架项目 `__uri`
  // replace: {
  //   search: '__uri',
  //   replace: 'require',
  //   attr: 'g'
  // },

  // 通过 webpack 的 DefinePlugin 传递给代码，值会自动做 JSON.stringify 处理。
  // define: {
  //   APIURL: 'http://www.baidu.com/'
  // },

  // 配置 webpack 的externals属性。
  // externals,
  // 例如，配置 react 和 react-dom 不打入代码
  // "externals": {
  //   "react": "window.React",
  //   "react-dom": "window.ReactDOM"
  // }

  // 配置 webpack 的 resolve.extensions 属性。自动解析确定的扩展。默认值为：'web.mjs', 'mjs', 'web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx','jsx',
  // extensions,

  // 配置 webpack 的 resolve.alias 属性。
  // alias,

  // 定义需要单纯做复制的文件列表，格式为数组，项的格式参考 copy-webpack-plugin 的配置。
  // copy,

  // 配置 browserslist，同时作用于 babel-preset-env 和 autoprefixer。
  browserslist: [
    '> 1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9', // React doesn't support IE8 anyway
  ],

  // 配置 webpack 的 optimization。默认配置minimize/minimizer，配置之后会进行合并。
  // 参考：https://webpack.docschina.org/configuration/optimization/
  // 参考splitChunks: https://juejin.im/post/5af1677c6fb9a07ab508dabb
  // optimization: {
  //   splitChunks: {
  //      chunks: "async", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
  //      minSize: 30000, // 最小尺寸，30000
  //      minChunks: 1, // 最小 chunk ，默认1
  //      maxAsyncRequests: 5, // 最大异步请求数， 默认5
  //      maxInitialRequests : 3, // 最大初始化请求书，默认3
  //      automaticNameDelimiter: '~',// 打包分隔符
  //      name: function(){}, // 打包后的名称，此选项可接收 function
  //      cacheGroups:{ // 这里开始设置缓存的 chunks
  //          priority: 0, // 缓存组优先级
  //          vendor: { // key 为entry中定义的 入口名称
  //              chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
  //              test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
  //              name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
  //              minSize: 30000,
  //              minChunks: 1,
  //              enforce: true,
  //              maxAsyncRequests: 5, // 最大异步请求数， 默认1
  //              maxInitialRequests : 3, // 最大初始化请求书，默认1
  //              reuseExistingChunk: true // 可设置是否重用该chunk
  //          }
  //      }
  //   }
  // },

  // 配置 webpack 的 devtool 属性。https://www.webpackjs.com/configuration/devtool/
  devtool: defaultDevtool,

  // 本地服务配置
  // devServer: {},

  // mockFile
  mockFile: 'mocker/index.js',

  // 本地服务代理配置
  // proxy: {
  //   '/app-finder-operation': {
  //     target: 'http://10.11.17.106:8080/',
  //     changeOrigin: true,
  //   },
  // },

  // 不同环境配置，如果build不是production，webpack mode不会设置为production
  // 本地开发使用 doly dev [env]，默认 development
  // 打包使用 doly build [env]，默认 production
  // env: {
  //   development: {},
  //   test: {},
  //   st02: {},
  //   production: {
  //     devtool: 'sourcemap',
  //     eslint: true,
  //   }
  // },

  // ---------------上面第一个版本实现，以下配置迭代实现---------------

  // 代码检查，支持本地自定义 .eslintrc，默认使用 airbnb 代码规范
  // eslint: false,

  // 配置主题，实际上是配 less 变量。支持对象和字符串两种类型，字符串需要指向一个返回配置的文件。
  // theme,

  // 定义额外的 babel preset 列表，格式为数组。
  // extraBabelPresets,

  // 定义额外的 babel plugin 列表，格式为数组。
  // extraBabelPlugins,

  // 定义额外需要做 babel 转换的文件匹配列表，格式为数组。
  // extraBabelIncludes,

  // 禁用 import() 按需加载，全部打包在一个文件里，通过 https://github.com/seeden/babel-plugin-dynamic-import-node-sync 实现。
  // disableDynamicImport,
}

