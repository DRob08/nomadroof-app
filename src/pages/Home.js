// pages/Home.js

import React from 'react';
import Registration from '../components/auth/Registration';
import Login from '../components/auth/Login';
import AuthForm from '../components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';
import {  logout } from '../api/axios';



const Home = ({ handleLogin, user, logged_in_status, handleLogout })  => {
  const navigate = useNavigate();
  // Function to handle registration success
  const handleAuthSuccess = (userData) => {
    console.log('Registration success in Home:', userData);
   
    // Call the handleLogin function to update login status and user data
    handleLogin(userData);
    
    // Redirect to the dashboard
    navigate('/dashboard');

  };

  const handleLogoutClick = async () => {
    try {
      // Call the logout function from api.js
      await logout();

      // Call the handleLogout function to update login status and user data
      handleLogout();
      
      // Redirect to the home page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      {/* Display the logged_in_status variable */}
      <p>Logged in status: {logged_in_status ? 'User is logged in' : 'User is not logged in'}</p>

      {/* Log Out button */}
      {logged_in_status && (
        <button onClick={handleLogoutClick}>Log Out</button>
      )}
      
     {/*  <Registration onRegistrationSuccess={handleAuthSuccess} logged_in_status={logged_in_status} />
      <Login onLoginSuccess={handleAuthSuccess}/> */}

      {/* <AuthForm isLogin onAuthSuccess={handleAuthSuccess} /> */}
    </div>
  );
};

export default Home;
