import React, { useState } from 'react';
import { loginUser, checkEmailAvailability } from '../../api/axios';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState([]);
  const [generalError, setGeneralError] = useState(null);
  const [emailAvailabilityError, setEmailAvailabilityError] = useState(null);

  const { onLoginSuccess } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email,
        password,
      };

      const response = await loginUser(userData);

      //console.log('Login successful:', response);

     /*  if (response.status === 'success') {
        onLoginSuccess(response.data);
      } */

      if (response.status === 'created' && response.logged_in) {
        // Redirect to the dashboard upon successful login
        onLoginSuccess(response.user);
      } else {
        // Handle other cases, e.g., show an error message
        console.error('Login failed:', response);
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        if (error.response.data.errors) {
          setLoginErrors(error.response.data.errors);

          const emailNotFoundError = error.response.data.errors.find(
            (errMsg) => errMsg === 'Email not found'
          );

          const incorrectPasswordError = error.response.data.errors.find(
            (errMsg) => errMsg === 'Incorrect password'
          );

          if (emailNotFoundError) {
            setGeneralError(emailNotFoundError);
          } else if (incorrectPasswordError) {
            setGeneralError(incorrectPasswordError);
          } else {
            setGeneralError('Login failed. Please fix the following errors:');
          }
        } else {
          setLoginErrors([]);
          setGeneralError('An unexpected error occurred during login.');
        }
      } else {
        setLoginErrors([]);
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleEmailBlur = async () => {
    try {
      const response = await checkEmailAvailability(email);

      if (response.available) {
       
        setEmailAvailabilityError('This email is not registered. Please sign up or try a different email.');
      } else {
        setEmailAvailabilityError(null);
      }
    } catch (error) {
      console.error('Email availability check error:', error);
      setEmailAvailabilityError('An error occurred while checking email availability. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {/* Display general error if any */}
      {generalError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{generalError}</p>
        </div>
      )}

      {/* Display login errors if any */}
      {loginErrors.length > 0 && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{generalError}</p>
          <ul>
            {loginErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {emailAvailabilityError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{emailAvailabilityError}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        {/* Your form inputs */}
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
