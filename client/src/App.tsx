import React from 'react';
import logo from './logo.svg';
import './App.css';
import EventDashboard from './components/EventDashboard'
import { BrowserRouter as Router, Route, Link,Routes } from 'react-router-dom';

function App() {
  return (

    <div className="App">
      <Router>
      {/* <header className="App-header"> 

      </header> */}
      <div className='App-body'>

          <EventDashboard />
          </div>
      </Router>
    </div>
  );
}

export default App;
