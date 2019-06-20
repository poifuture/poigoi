import React from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <ruby>私<rt>わたし</rt></ruby>たちの<ruby>夢<rt>ゆめ</rt></ruby>がここから<ruby>始<rt>はじ</rt></ruby>まります ٩(ˊᗜˋ*)و
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
