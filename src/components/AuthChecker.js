// AuthChecker.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication } from '../api/axios';

const AuthChecker = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const authenticate = async () => {
        try {
          const response = await checkAuthentication();
          console.log('Authentication response:', response);

          // Check if the user is authenticated
          if (!response.authenticated) {
            // Use navigate to redirect to the login page without a full page reload
            navigate('/auth/login');
          }
        } catch (error) {
          console.error('Authentication check failed:', error);
          // Handle error if needed
        }
      };

      authenticate();
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default AuthChecker;
