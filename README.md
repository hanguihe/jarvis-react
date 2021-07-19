## jarvis-react

React 开发工具合集：

- 本地开发和构建 `React` 应用
- 本地开发和构建多种模块化方案的 `React` 组件
- 初始化项目的 `tsconfig` `eslint` `prettier` 等配置

### 功能

[ ] 初始化项目/组件开发模板

[x] 初始化项目配置文件：tsconfig jsconfig perttier eslint stylelint editorconfig

[x] 使用 webpack-dev-server 本地开发应用

[x] 使用 webpack 打包应用

[x] 使用 babel 编译 CommonJS 格式的组件

[x] 使用 babel 编译 ESModules 格式的组件

[x] 使用 rollup 编译 UMD 格式的组件

[ ] 本地开发组件

### install

```bash
$ npm install -g jarvis-react
```

### 快速上手

1. 初始化项目配置

```bash
jarvis init config
```

2. 本地开发 React 应用或组件

```bash
$ jarvis dev
```

3. 构建 React 应用或组件

```bash
$ jarvis build
```

### 配置文件

在本地开发应用或组件时，支持自定义配置文件。在根目录下创建`jarvis.config.js`，内容如：

```javascript
module.exports = {
  mode: 'app',
};
```

### 共同配置项

#### mode

设定当前开发模式

类型：`"app" | "component"`

默认值：`"app"`

- app 为 React 应用，
- component 为 React 组件

#### outDir

设定输出文件夹

类型：`string`

当 mode 的值为 app 时，outDir 默认值为 dist

当 mode 的值为 component 时

- CommonJS 格式默认值为`lib`
- ESModules 格式默认值为`lib`
- UMD 格式默认值为`dist`

### port

本地开发时启动的端口

类型：`number`

默认值：`3000`

#### proxy

本地代理 与 devServer 一致[Proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy)

```
proxy: {
  '/api': {
    target: 'https://other-server.example.com',
    secure: false,
    changeOrigin: true
  },
}
```

### App 配置项

#### sourceMap

是否输出 map 文件

类型: `bollean`

默认值: `false`

在 development 模式下，默认开启 sourceMap。production 时才会读取该配置项

#### themes

配置 less 变量（主题）

类型：`Record<string, string>`

默认值：`{}`

// TODO antd 的主题支持

### Component 配置项

#### umd

是否输出 UMD 格式包

类型：`boolean`

默认值：`false`

#### external

外链，指定使用外部方式加载的包（不会打包到源代码中）。仅在 umd 格式下生效

[Rollup external](https://rollupjs.org/guide/en/#external)

类型：`string[]`

默认值：`["react","react-dom"]

#### globals

外部依赖的变量名称，与 external 一起使用。仅在 umd 格式下生效

[Rollup globals](https://rollupjs.org/guide/en/#outputglobals)

默认值：

```json
{
  "react": "React",
  "react-dom": "ReactDOM"
}
```

#### name

配置全局环境下的变量名称，如`window.xxx`

[Rollup name](https://rollupjs.org/guide/en/#outputname)

类型：`string`

默认值：package.json 下的 name 字段
