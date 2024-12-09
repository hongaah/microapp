import React from 'react';
import logo from './logo.svg';
import BtnCom from './Button/index.jsx';
import './App.css';

const RemoteLink = React.lazy(() => import('bbb-app/Link'));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BtnCom />
        <RemoteLink />
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
