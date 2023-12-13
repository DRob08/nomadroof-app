// api.js

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  // Uncomment the following line if you have an environment variable set
  // baseURL: process.env.REACT_APP_URL_QCERT_API,
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/registrations', { user: userData }, {withCredentials: true});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
    try {
      const response = await api.post('/sessions', { user: userData }, {withCredentials: true});
      return response.data;

    } catch (error) {
      throw error;
    }
  };
  

export const checkEmailAvailability = async (email) => {
    try {
      const response = await api.post('/registrations/check_email', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const checkLoginStatus = async () => {
    try {
      const response = await api.get('/logged_in', { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const logout = async () => {
    try {
      const response = await api.delete('/logout', { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  export const confirmEmail = async (token) => {
    try {
      console.log('confirmEmail function called with token:', token);
      const response = await api.post(`/confirm_email/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error confirming email:', error);
      throw error;
    }
  };

 export const checkAuthentication = async () => {
    try {
      const response = await api.get('/authenticated', { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const updateUser = async (userData) => {
    try {
      console.log('Updating user with data:', userData);
  
      const response = await api.put('/users', { user: userData }, { withCredentials: true });
  
      console.log('Update user response:', response.data);
  
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
  
  
  
  

