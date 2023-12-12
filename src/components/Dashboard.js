import React, { useEffect, useState } from 'react';
import AuthChecker from './AuthChecker';
import { checkAuthentication } from '../api/axios'; // Adjust the path

const Dashboard = ({ logged_in_status }) => {
  const [emailNotAuthenticated, setEmailNotAuthenticated] = useState(false);

  useEffect(() => {
    const checkEmailAuthentication = async () => {
      try {
        const response = await checkAuthentication();
        const user = response.user;

        // Check if confirmation_token indicates email not authenticated
        const isEmailNotAuthenticated = user.confirmation_token !== null;
        setEmailNotAuthenticated(isEmailNotAuthenticated);
      } catch (error) {
        console.error('Error checking email authentication:', error);
      }
    };

    checkEmailAuthentication();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Sidebar */}
      <div style={{ width: '200px', background: '#f0f0f0', padding: '20px', boxSizing: 'border-box' }}>
        <p>Sidebar Content</p>
        {/* Add more sidebar content as needed */}
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '220px', padding: '20px', boxSizing: 'border-box' }}>
        <h2>Main Content</h2>
        <p>This is the main content of the dashboard.</p>

        {/* Display message if email not authenticated */}
        {emailNotAuthenticated && (
          <div className="alert alert-warning" role="alert">
            Your email is not yet authenticated. Please check your email and confirm your account.
          </div>
        )}

        {/* Add more main content as needed */}
        
        <p>Logged In: {logged_in_status ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default AuthChecker(Dashboard);
