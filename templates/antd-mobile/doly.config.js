module.exports = {
  entry: 'src/views/index/index.js',
  outputPath: 'dist',
  outputFilename: '[name].[hash].js',
  publicPath: '/',
  html: {
    template: 'src/index.html', // 指定要打包的html路径和文件名
    filename: 'index.html', // 指定输出路径和文件名
  },
  image: {
    name: '[name].[hash:8].[ext]', // 文件名
    limit: 1024*8 // 小于该大小的图片转为base64
  },

  css: {
    filename: '/assets/css/[name].[contenthash:8].css'
  },

  browserslist: [
    '>1%',
    'iOS >= 8',
    'Android >= 4',
    'last 4 versions',
    'Firefox ESR'
  ],

  define: {
    APIURL: 'https://dev.example.com/',
    APP_ENV: 'development',
  },

  env: {
    development: {
      publicPath: '/',
      define: {
        APIURL: 'https://prod.example.com/',
        APP_ENV: 'development',
      }
    },

    stage: {
      publicPath: 'https://',
      define: {
        APIURL: 'https://prod.example.com/',
        APP_ENV: 'stage',
      }
    },
    // 生产环境配置
    production: {
      publicPath: '/',
      outputFilename: 'assets/js/[name].[hash].js',
      html: {
        template: 'src/index.html', // 指定要打包的html路径和文件名
        filename: 'index.html', // 指定输出路径和文件名
      },
      css: {
        filename: 'assets/css/[name].[contenthash:8].css'
      },
      image: {
        outputPath: 'assets/img', // 图片输出地址，默认 images
        name: '[name].[hash:8].[ext]', // 文件名
        limit: 1024*8 // 小于该大小的图片转为base64
      },
      define: {
        APIURL: 'https://prod.example.com/',
        APP_ENV: 'production',
      }
    }
  },
  extraBabelPlugins: [['import', { libraryName: 'antd-mobile', style: true }]],
    extraPostCSSPlugins: [
    // 默认vw布局，想到替换rem可自行配置
    require('postcss-px-to-viewport')({
      "unitToConvert": "px",
      "viewportWidth": 750, //  默认宽度750，可配置
    }),
  ]
};
