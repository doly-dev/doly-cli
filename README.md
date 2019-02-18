# doly-cli

`doly-cli` 是一个包含 `init` `dev` `build` 的命令行工具，参考了 react-dev-utils，create-react-app，roadhog， umi等优秀工具。

## 功能
- 📦 开箱即用的 react 应用开发工具，内置 css-modules、babel、less、sass、postcss、HMR 等
- 🚨 create-react-app 的体验
- 🐠 扩展 webpack 配置
- ✂️ mock
- ✨ 支持开发和构建不同 env 环境配置
- 🍰 支持js/css/image构建自定义目录

## 快速开始

```javascript
# 全局安装
npm install doly-cli -g

# 查看版本
doly -v

# 初始化项目脚手架
doly init [projectName]

# 本地开发。代码编译并启动本地服务，env 默认 development 环境
doly dev [env]

# 打包。env 默认 production 环境
doly build [env]

```

## Mock

`doly dev` 支持 `mock` 功能，默认文件 `mocker/index.js` 中进行配置。配置将传给 [mocker-api](https://www.npmjs.com/package/mocker-api)

示例：

```javascript
export default {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1,2] },

  // GET POST 可省略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => { res.end('OK'); },
};
```

## 使用 public 目录

我们约定 `public` 目录下的文件会在 `dev` 和 `build` 时被自动 `copy` 到输出目录（默认是 `./dist`）下。所以可以在这里存放 favicon, iconfont, html里引用的图片等。

## 不同环境配置

通过 [env](#env) 实现，`env` 除默认 `development` 和 `production` 外，可以任意配置。

`doly dev [env]` 本地开发中可以运行不同环境配置，默认 `env` 为 `development` 。
`doly build [env]`打包不同环境配置，默认 `env` 为 `production` 。

本地开发运行生产环境:

```javascript
# 本地开发读取生产环境配置
doly dev production

# 本地开发读取测试环境配置
doly dev test

# 打包开发环境配置
doly build development

# 打包测试环境配置
doly build test
```

即运行 `env` 对应环境配置项和默认配置项的合并配置。

doly.config.js

```javascript
module.exports = {
  define: {
    APIURL: 'https://dev.example.com/'
  },
  env: {
    test: {
      define: {
        APIURL: 'https://test.example.com/'
      }
    },
    sit: {
      define: {
        APIURL: 'https://sit.example.com/'
      }
    },
    production: {
      define: {
        APIURL: 'https://prod.example.com/'
      }
    }
  }
}
```

## 配置

`doly` 封装了 `webpack` 部分功能。如需配置，在项目根目录新建 `doly.config.js` 完成。如果是基于 `init` 的项目目录结构，并且没有资源文件的目录规则要求，可以零配置进行开发。

示例：

```javascript
module.exports = {
  ...
}
```

索引：

- [entry](#entry)
- [outputPath](#outputPath)
- [zip](#zip)
- [outputFilename](#outputFilename)
- [outputChunkFilename](#outputChunkFilename)
- [publicPath](#publicPath)
- [hash](#hash)
- [ignoreMomentLocale](#ignoreMomentLocale)
- [manifest](#manifest)
- [html](#html)
- [image](#image)
- [css](#css)
- [cssInline](#cssInline)
- [disableCSSModules](#disableCSSModules)
- [disableCSSSourceMap](#disableCSSSourceMap)
- [replace](#replace)
- [define](#define)
- [externals](#externals)
- [extensions](#extensions)
- [copy](#copy)
- [browserslist](#browserslist)
- [devServer](#devServer)
- [optimization](#optimization)
- [devtool](#devtool)
- [mockFile](#mockFile)
- [proxy](#proxy)
- [env](#env)

### entry

指定 webpack 入口文件，支持 glob 格式。默认：

```javascript
entry: 'src/app.js'
```

如果是多页面多入口，请使用对象模式，并配置 optimization的splitChunks

```javascript
entry: {
  bar: 'src/bar.js',
  foo: 'src/foo.js'
}
```

又比如你希望把 `src/pages` 的文件作为入口。可以这样配：

```javascript
entry: 'src/pages/*.js'
```

### outputPath

配置 webpack 的 output.publicPath 属性。默认：

```javascript
outputPath: 'dist'
```

### zip

配置构建完成后生成的 `zip` 文件，options 将传给 [zip-webpack-plugin](https://www.npmjs.com/package/zip-webpack-plugin)，默认无配置。

示例：

```javascript
zip: {
  path: '../build',
  filename: 'project.zip'
}
```

### outputFilename

配置 webpack 的 output.filename 属性。如果设置该值，`hash`配置对该项无效，需自己配置文件名 `hash`。默认：

```javascript
outputFilename: '[name].[chunkhash:8].js'
```

也可以自定义目录

```javascript
outputFilename: 'res/i/[name].[chunkhash:8].js'
```

### outputChunkFilename

配置 webpack 的 output.chunkFilename 属性。如果设置该值，`hash`配置对该项无效，需自己配置文件名 `hash`。默认：

```javascript
chunkFilename: '[name].[chunkhash:8].chunk.js'
```

也可以自定义目录

```javascript
chunkFilename: 'res/i/[name].[chunkhash:8].chunk.js'
```

### publicPath

配置 webpack 的 output.publicPath 属性。默认：

```javascript
publicPath: '/'
```

### hash

配置让构建资源文件名带 hash，通常会和 manifest 配合使用。如果单独设置了 `outputFilename ` `outputChunkFilename ` `css.filename` `css.chunkFilename` 则需要单独指定`filename` 的hash。默认：

```javascript
hash: true
```

### ignoreMomentLocale

忽略moment 的 locale 文件,用于减少尺寸。默认：

```javascript
ignoreMomentLocale: true
```

### manifest

配置后会生成 `manifest.json`，option 传给 [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin)。默认为空。

示例：

```javascript
manifest: {
  basePath: 'http://www.xxx.com/',
  filename:
},
```

### html

配置页面信息，option 传给 [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)。默认：

```javascript
html: [{
  template:'src/index.html', // 指定要打包的html路径和文件名
  filename: 'index.html', // 指定输出路径和文件名
}]
```

### image

配置图片 [url-loader](https://www.npmjs.com/package/url-loader)。默认：

```javascript
image: {
  outputPath: 'images', // 图片输出地址，默认 images
  limit: 1024*8 // 8kb内的图片转为base64
}
```

也可以自定义目录

```javascript
image: {
  outputPath: 'res/i', // 图片输出地址，默认 images
  limit: 1024*8 // 8kb内的图片转为base64
}
```

### css

配置 [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin)。如果设置 `filename`，`hash`配置对该项无效，需自己配置文件名 `hash`。如果设置 `cssInline` 为 `true`，该配置无效。默认：

```javascript
css: {
  filename: '[name].[contenthash:8].css',
  chunkFilename: '[name].[contenthash:8].chunk.css'
}
```

也可以自定义目录

```javascript
css: {
  filename: 'res/c/[name].[contenthash:8].css',
  chunkFilename: 'res/c/[name].[contenthash:8].chunk.css'
}
```

### cssInline

设置为 `true` 后，样式将通过 `style-loader` 转换。默认 `false`

### disableCSSModules

禁用 CSS Modules。默认 `false`

### disableCSSSourceMap

禁用 CSS 的 SourceMap 生成。默认 `false`

### replace

配置 [webpack-replace-loader](https://www.npmjs.com/package/webpack-replace-loader)，替换`js/jsx`中的文本。例如fis的图片资源定位符 `__uri`，资源路径需改为相对路径。

示例：

```javascript
replace: {
  search: '__uri',
  replace: 'require',
  attr: 'g'
},
```

### define

通过 `webpack` 的 [DefinePlugin](https://webpack.docschina.org/plugins/define-plugin) 传递给代码，值会自动做 `JSON.stringify` 处理。

示例：

```javascript
define: {
  APIURL: 'http://www.xxx.com/'
}
```

### externals

配置 webpack 的[externals](https://webpack.docschina.org/configuration/externals/)属性。

例如，配置 react 和 react-dom 不打入代码

html:

```html
<script src='https://unpkg.com/react@16.8.1/umd/react.production.min.js'></script>
<script src='https://unpkg.com/react-dom@16.8.1/umd/react-dom.production.min.js'></script>
```

doly.config.js:

```javascript
externals: {
  react: 'window.React',
  react-dom: 'window.ReactDOM'
}
```

### extensions

配置 webpack 的 resolve.extensions 属性。自动解析确定的扩展。默认值为：'web.mjs', 'mjs', 'web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx','jsx'。配置之后会进行合并。

### alias

配置 webpack 的 resolve.alias 属性。

### copy

定义需要单纯做复制的文件列表，格式为数组，项的格式参考 [copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin) 的配置。

### browserslist

配置 [browserslist](https://www.npmjs.com/package/browserslist)，同时作用于 `babel-preset-env` 和 `autoprefixer`。默认：

```javascript
browserslist: [
  'last 2 versions',
  '> 1%'
]
```

### optimization

配置 webpack 的 [optimization](https://webpack.docschina.org/configuration/optimization/)。默认配置了minimize/minimizer，配置之后会进行合并。如果需要进行代码拆分可以配置 [splitChunks](https://juejin.im/post/5af1677c6fb9a07ab508dabb)

### devtool

配置 webpack 的 [devtool](https://www.webpackjs.com/configuration/devtool/) 属性。默认区分开发和生产环境：

非 `production` 环境：

```javascript
devtool: 'cheap-module-source-map'
```

`production` 环境：

```javascript
devtool: undefined
```

### devServer

配置 [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)

### mockFile

配置`mock`文件。默认：

```javascript
mockFile: 'mocker/index.js'
```

mocker/index.js 示例

```javascript
export default {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1,2] },

  // GET POST 可省略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => { res.end('OK'); },
};
```

### proxy

本地服务代理配置，参考[mocker-api](https://www.npmjs.com/package/mocker-api)

示例：

```javascript
proxy: {
	'/app': {
		target: 'http://xxx/',
		changeOrigin: true,
	},
},
```

### env

不同环境配置，如果build不是production，webpack mode不会设置为production。

本地开发使用 `doly dev [env]`，`env` 默认 development。

打包使用 `doly build [env]`，`env` 默认 production。





