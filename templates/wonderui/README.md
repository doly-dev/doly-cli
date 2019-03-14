# scaffold-wonder-ui

> 本地环境需安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)

基于 [mobx](https://cn.mobx.js.org/) + [react](https://facebook.github.io/react/) + [wonderui](https://github.com/jian263994241/wonderjs/tree/v2) 的脚手架， 适用于移动端、PC端开发

构建工具使用的是 [doly-cli](https://www.npmjs.com/package/doly-cli) 

## 目录结构

```
├── mocker                   # 本地模拟数据
├── src
│   ├── assets               # 本地静态资源，图片、样式、字体等
│   ├── components           # 业务通用组件
│   ├── pages                # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── stores               # 存储state的store
│   ├── utils                # 工具库
│   ├── app.js               # 全局 JS
│   ├── app.less             # 全局样式
│   ├── default.html         # html页面
│   ├── doly.config.js       # doly 配置
├── package.json
├── README.md

```

## 本地开发

### 安装依赖

```shell
npm install 
```

> 如果网络状况不佳，可以使用 [cnpm](https://cnpmjs.org/) 进行加速。

### 运行

```shell
npm start
```

> 启动完成后会自动打开浏览器访问 [http://localhost:9000](http://localhost:9000)

### 打包

```shell
npm run build
```

---

**tips** 

通过 `doly.config.js` `env` 可实现[不同环境配置](https://www.npmjs.com/package/doly-cli#%E4%B8%8D%E5%90%8C%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE)

例如，在 `package.json` 中的 `script` 加入 `"start:sit": "doly dev sit"` ，终端运行

```shell
npm run start:sit
```

即可运行 `sit` 环境配置的代码。

同理，打包也支持不同环境


