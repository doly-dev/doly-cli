module.exports = {
  entry: 'src/app.js',
  outputPath: 'dist',
  publicPath: '/',
  html: {
    template: 'src/default.html', // 指定要打包的html路径和文件名
    filename: 'index.html', // 指定输出路径和文件名
  },

  // 禁用css modules
  disableCSSModules: true,

  // js文本替换，兼容fis脚手架项目 `__uri`。资源路径需改为相对路径
  // replace: {
  //   search: '__uri',
  //   replace: 'require',
  //   attr: 'g'
  // },

  define: {
    APIURL: 'https://dev.example.com/'
  },

  env: {
    production: {
      publicPath: 'https://img.99bill.com/',
      outputFilename: 'res/j/[name].[hash].js',
      html: {
        template: 'src/default.html', // 指定要打包的html路径和文件名
        filename: 'seashell/webapp/default/test/default.html', // 指定输出路径和文件名
      },
      cssInline: false,
      css: {
        filename: 'res/c/[name].[contenthash:8].css'
      },
      image: {
        outputPath: 'res/i', // 图片输出地址，默认 images
        name: '[name].[hash:8].[ext]', // 文件名
        limit: 1024*8 // 小于该大小的图片转为base64
      },

      // 定义生产环境的值
      define: {
        APIURL: 'https://prod.example.com/'
      },
    }
  }
}

