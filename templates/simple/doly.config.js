module.exports = {
  // entry: 'src/app.js',
  // outputPath: 'dist',
  // outputFilename: 'res/j/[name].[hash].js',
  // publicPath: '/',
  // html: {
  //   template: 'src/index.html', // 指定要打包的html路径和文件名
  //   filename: 'default.html', // 指定输出路径和文件名
  // },
  // image: {
  //   outputPath: 'res/i', // 图片输出地址，默认 images
  //   name: '[name].[hash:8].[ext]', // 文件名
  //   limit: 1024*8 // 小于该大小的图片转为base64
  // },

  // // 配置 MiniCssExtractPlugin 。设置filename之后，hash配置无效，需自己配置hash。如果设置cssInline为true，该配置无效。
  // css: {
  //   filename: 'res/c/[name].[contenthash:8].css'
  // },

  // js文本替换，兼容fis脚手架项目 `__uri`
  // replace: {
  //   search: '__uri',
  //   replace: 'require',
  //   attr: 'g'
  // },

  // 通过 webpack 的 DefinePlugin 传递给代码，值会自动做 JSON.stringify 处理。
  define: {
    APIURL: 'https://dev.example.com/'
  },

  env: {
    production: {
      APIURL: 'https://prod.example.com/'
    }
  }
}

