# 模块联邦 Module Federation

Module Federation 是 webpack5 提供的用于应用之间共享模块的机制，只要用 ModuleFederationPlugin 声明 exposes 的模块，另一个应用里用 ModuleFederationPlugin 声明 remotes 导入的模块，就可以直接用别的应用的模块了。这就是它为什么会叫模块联邦。

除了业务模块外，库模块也可以共享。只不过要注意这些模块都是异步加载的，所以要用 import()来异步引入。单独引入异步组件需要用 React.lazy(() => import('xx/yy')) 的形式，或者把整个应用用 import() 来异步加载。

此外，还要注意要固定 output.publicPath，不然引入模块的时候路径会有问题。

Module Federation 是天生的模块级微前端，它和 qiankun 一样，都是用到另一个应用的代码时，异步去某个地址下载它的代码，然后跑起来，只不过一个是应用级，一个是模块级。

```js :webpack.config.js aaa 的 webpack 配置
// visit aaa: localhost:3000
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = function () {
  return {
    output: {
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      // publicPath: paths.publicUrlOrPath,
      publicPath: 'http://localhost:3000/',
    },
    plugins: [
      // 创建一个 name 为 aaa_app 的共享包。这个共享包 exposes 暴露出了 Button 这个共享模块。它对应的文件名是 aaaEntry.js。
      // 重跑服务后会看到页面请求了 aaaEntry.js 这个文件，里面声明了一个 aaa_app 的变量。这就是说 webpack 把这个组件的代码分离到了这个文件里。这样别的 webpack 应用就可以直接用这个组件了。
      new ModuleFederationPlugin({
        name: 'aaa_app',
        filename: 'aaaEntry.js',
        exposes: {
          './Button': './src/Button/index.jsx',
        },
        remotes: {
          'bbb-app': 'bbb_app@http://localhost:3001/bbbEntry.js',
        }
      }),
    ],
  };
};
```

```js :webpack.config.js bbb 的 webpack 配置
// visit bbb: localhost:3001
// 引入 aaa 的 Button 组件
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = function () {
  return {
    publicPath: 'http://localhost:3001/',
    plugins: [
      new ModuleFederationPlugin({
        name: 'bbb_app',
        filename: 'bbbEntry.js',
        // 导出 bbb 应用的 link 组件
        exposes: {
          './Link': './src/Link/index.jsx'
        },
        // 引入的时候使用 remotes 注册，这段配置就是注册了一个运行时的 Module，名字叫 aaa-app，它的值来自 http://localhost:3000/aaaEntry.js 这个文件里的 aaa_app 变量。
        remotes: {
          'aaa-app': 'aaa_app@http://localhost:3000/aaaEntry.js'
        }
      }),
    ],
  };
};

```

```js :app.jsx bbb 使用 aaa 的 Button
// 因为是异步组件，所以用 React.lazy 包裹，具体取这个组件的逻辑就是用 webpack 提供的 import() 来异步加载模块。
const RemoteButton = React.lazy(() => import('aaa-app/Button'));
```

作者：zxg_神说要有光
链接：https://juejin.cn/post/7211451845033295927
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
