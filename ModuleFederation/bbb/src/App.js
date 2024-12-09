import React from 'react';
import logo from './logo.svg';
import './App.css';

// 因为是异步组件，所以用 React.lazy 包裹，具体取这个组件的逻辑就是用 webpack 提供的 import() 来异步加载模块。
const RemoteButton = React.lazy(() => import('aaa-app/Button'));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RemoteButton />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
