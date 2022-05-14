import React from 'react';
import logo from './logo.svg';
import './App.css';
import EventDashboard from './components/EventDashboard'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import NewEvent, { EventType } from './components/NewEvent';
import Map from './components/Map';
import Navigation from './components/Navigatoion';
import Home from "./components/Home"
import EventDetails from './components/EventDetails';

function App() {
  return (

    <div className="App">
      <Router>
        <header >
          <Navigation />
        </header>
        <div >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/createEvent' element={<NewEvent type={EventType.NEW}/>} />
            <Route path='/eventDashBoard' element={<EventDashboard />} />
            <Route path='/event/:eventId' element={<EventDetails />} />
          </Routes>

          {/* <NewEvent type={EventType.NEW}/> */}
        </div>
      </Router>
    </div>
  );
}

export default App;
