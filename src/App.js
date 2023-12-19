import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Dashboard from './components/Dashboard';
import Dashboard from './pages/Dashboard'; 
import React, { useState, useEffect } from 'react';
import Home from './pages/Home'; // Import the Home component
import AuthPage from './pages/AuthPage';
import {  checkLoginStatus } from './api/axios';
import Navbar from './components/common/Navbar'; 
import EmailConfirmationPage from './pages/EmailConfirmationPage'; 
import AddPropertyPage from './pages/AddPropertyPage';


/* function App() {
  return (
    <div className="App">
      <header className="App-header">
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
} */

const App = () => {
  const [user, setUser] = useState(null);
  const [userLoggedInStatus, setUserLoggedInStatus] = useState(false);

  // Function to handle user login and update the login status and user data
  const handleLogin = (userData) => {
    // You can perform any login logic here
    // For simplicity, we're just setting the login status to true and storing user data
    setUser(userData);
    setUserLoggedInStatus(true);
  };

  const handleLogout = () => {
    // For simplicity, we're just clearing user data and setting the login status to false
    setUser(null);
    setUserLoggedInStatus(false);
    console.log('Log Out Completed....');
  };
  

  const fetchLoginStatus = async () => {
    try {
      const response = await checkLoginStatus();
      // console.log('fetchLoginStatus -> Login status response:', response);
    //   console.log('fetchLoginStatus -> logged_in:', response.logged_in);
    //   console.log('fetchLoginStatus -> userLoggedInStatus:', userLoggedInStatus);
  
      // Handle the response as needed, e.g., update user data and login status
      if (response.logged_in && !userLoggedInStatus) {
        setUser(response.user);
        setUserLoggedInStatus(true);
        //console.log('fetchLoginStatus -> User logged in:', response.user);
      } else if (!response.logged_in && userLoggedInStatus) {
        // If the actual login status is false, but state says user is logged in, update the state
        setUser(null);
        setUserLoggedInStatus(false);
        //console.log('fetchLoginStatus -> Clearing login variables');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      await fetchLoginStatus();
    };
  
    fetchData();
  }, []);
  

  return (
    <Router>
      <div className="App">
      <Navbar userLoggedInStatus={userLoggedInStatus} handleLogout={handleLogout} />
        
        <Routes>
           {/* Pass the handleLogin function, user data, and userLoggedInStatus prop to the Home component */}
           <Route
            path="/"
            element={<Home handleLogin={handleLogin} handleLogout={handleLogout} user={user} logged_in_status={userLoggedInStatus} />}
          />
          <Route path="/dashboard" element={<Dashboard logged_in_status={userLoggedInStatus} user={user} />} />
          <Route path="/auth/*" element={<AuthPage handleLogin={handleLogin} />} />
          <Route path="/confirm-email/:token" element={<EmailConfirmationPage />} />
          <Route path="/add-property" element={<AddPropertyPage />} />
        </Routes>
        
      
      </div>
    </Router>
  );
};



export default App;
