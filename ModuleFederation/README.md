# 模块联邦 Module Federation

Module Federation 能够把一个应用的一些模块导出，供别的应用异步引入这些模块。

方式就是一个应用比如 aaa 通过 ModeleFederationPlugin 声明 exposes 的模块名字和路径，另一个应用 bbb 通过 remotes 声明用到的一些模块来自于哪个文件的哪个变量。
这样当用到这个模块的时候，就回去异步请求对应的 url，取出其中的变量值。
这里要特别注意导出模块的应用 aaa 需要固定 publicPath，不然加载文件的路径会有问题。
我们完成了应用 aaa 导出 Button 在另一个应用 bbb 里用，这个是单向的。

```js :webpack.config.js aaa 的 webpack 配置
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
        }
      }),
    ],
  };
};
```

```js :webpack.config.js bbb 的 webpack 配置
// 引入 aaa 的 Button 组件
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = function () {
  return {
    plugins: [
      // 引入的时候使用 remotes 注册，这段配置就是注册了一个运行时的 Module，名字叫 aaa-app，它的值来自 http://localhost:3000/aaaEntry.js 这个文件里的 aaa_app 变量。
      new ModuleFederationPlugin({
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
