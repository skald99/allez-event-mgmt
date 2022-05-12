import React from 'react';
import logo from './logo.svg';
import './App.css';
import EventDashboard from './components/EventDashboard'
import { BrowserRouter as Router, Route, Link,Routes } from 'react-router-dom';
import NewEvent, { EventType } from './components/NewEvent';
import Map from './components/Map';

function App() {
  return (

    <div className="App">
      <Router>
      <div className='App-body'>
        <NewEvent type={EventType.NEW}/>
      </div>
      </Router>
    </div>
  );
}

export default App;
