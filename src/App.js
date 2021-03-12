import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MDCSlider } from '@material/slider';
import Slider from './components/sliders/materialDesignSlider';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{width: "80vw"}} className="no_select">
        <Slider id={"slider0"} />
        </div>
        <p className="no_select">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link no_select"
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
