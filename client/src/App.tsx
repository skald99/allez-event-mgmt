import React from 'react';
import './App.css';
import EventDashboard from './components/EventDashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewEvent, { EventType } from './components/NewEvent';
import Navigation from './components/Navigation';
import Home from "./components/Home"
import EventDetails from './components/EventDetails';
import RegisteredEvents from './components/RegisteredEvents';
import Auth from "./components/Auth";
import Error from './components/PageNotFound'
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
            <Route path='users' element={<Auth/>}>
              {/* <Route path=':userId' element={<UserProfile/>}></Route> */}
            </Route>
            <Route path='events'>
              <Route path='create' element={<NewEvent type={EventType.NEW}/>}/>
              <Route path=':eventId' element={<EventDetails/>}/>
              <Route path='edit/:eventId' element={<NewEvent type={EventType.EDIT}/>}/>
            </Route>

            <Route path='/eventDashBoard' element={<EventDashboard />} />
            <Route path='/registeredEvents' element={<RegisteredEvents />}/>
            <Route path='/error' element={<Error />} />
            <Route path='*' element={<Error />} />
          </Routes>

        </div>
      </Router>
      <script src="../path/to/flowbite/dist/flowbite.js"></script>
    </div>
  );
}

export default App;
