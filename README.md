# 微前端

微前端就是可以一个页面跑多个 vue、react 甚至 jquery 等不同项目，它之间的 JS、CSS 相互隔离运行，不会相互影响，但也有通信机制可以通信。

微前端实现：当路由切换的时候，去下载对应应用的代码，然后跑在容器里。qiankun、wujie、micro-app 的区别主要还是实现容器（或者叫沙箱）上有区别，比如 qiankun 是 function + proxy + with，micro-app 是 web components，而 wujie 是 web components 和 iframe。

## 框架选型

### single-spa

- single-spa 是一个将多个单页面应用聚合为一个整体应用的 JavaScript 微前端框架。
single-spa 要求子应用修改渲染逻辑并暴露出三个方法：bootstrap、mount、unmount，分别对应初始化、渲染和卸载，这也导致子应用需要对入口文件进行修改。而 qiankun 是基于single-spa进行封装，所以这些特点也被 qiankun 继承下来，并且需要对 webpack 配置进行一些修改，成本相对较高。

single-spa 的实现原理就是就是监听路由变化，路由切换的时候加载、卸载注册的应用的代码。只不过 single-spa 的入口是一个 js 文件，需要代码里手动指定要加载啥 js、css 等，不方便维护。

### qiankun

- [qiankun](https://qiankun.umijs.org/zh/) 蚂蚁金服出品，基于 single-spa 封装的微前端框架，升级了第一个就是入口，改为了 html 作为入口，解析 html，从中分析 js、css，然后再加载，这个是 import-html-entry 这个包实现的。所以在 qiankun 的 package.json 里可以看到 single-spa 和 import-html-entry 这两个依赖。

qiankun 的 JS 沙箱实现方案：把 js 代码包裹了一层 function，然后再把内部的 window 用 Proxy 包一层，用 with 修改了 window，这样内部的代码包括 window 就被完全隔离了，这样就实现了一个 JS 沙箱。

优劣：用的最多，相对比较成熟，社区活跃。webpack体系、接入相对比较重

### microapp

- [MicroApp](https://micro-zoe.github.io/micro-app/) 京东出品，一款基于WebComponent的思想，轻量、高效、功能强大的微前端框架。借鉴了 WebComponent 的思想，通过 CustomElement 结合自定义的 ShadowDom，将微前端封装成一个类WebComponent 组件，从而实现微前端的组件化渲染。并且由于自定义ShadowDom的隔离特性，micro-app不需要像single-spa和qiankun一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改 webpack 配置，是目前市面上接入微前端成本最低的方案。

###  module-federation

Module Federation 是 webpack 5 的特性，自由度更高

🌰：ModuleFederation\README.md

### iframe

需要自定义实现css隔离、js沙箱、路由劫持等功能

### 其他

- wujie：wujie 是腾讯出品的一款微前端框架。作为改良派的代表，它认为：iframe 虽然问题很多，但仅把它作为一个 js 沙箱去用，表现还是很稳定的，毕竟是浏览器原生实现的，比自己实现 js 沙箱靠谱多了。至于 iframe 的弊端，可以针对性的去优化：JS 放 iframe 里运行，DOM 放 webComponent 渲染。

- microapp
https://www.cnblogs.com/jingdongkeji/p/17370284.html
