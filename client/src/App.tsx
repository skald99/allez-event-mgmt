import React from 'react';
import './App.css';
import EventDashboard from './components/EventDashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewEvent, { EventType } from './components/NewEvent';
import Navigation from './components/Navigation';
import Home from "./components/Home"
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import EventDetails from './components/EventDetails';
import Auth from "./components/Auth";
function App() {
  return (
    <div className="App">
      <script src="../path/to/flowbite/dist/flowbite.js"></script>
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
            <Route path='/events'>
              <Route path='create' element={<NewEvent type={EventType.NEW}/>}/>
              <Route path=':eventId' element={<EventDetails/>}>
                <Route path='edit' element={<NewEvent type={EventType.EDIT}/>}/>
              </Route>
            </Route>

            <Route path='/eventDashBoard' element={<EventDashboard />} />
            {/* <Route path='/event/:eventId' element={<EventDetails />} /> */}
          </Routes>

          {/* <NewEvent type={EventType.NEW}/> */}
        </div>
      </Router>
    </div>
  );
}

export default App;
