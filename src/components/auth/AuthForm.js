import React, { useState } from 'react';
import { loginUser, registerUser, checkEmailAvailability } from '../../api/axios';

const AuthForm = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [formErrors, setFormErrors] = useState([]);
  const [emailAvailabilityError, setEmailAvailabilityError] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFormErrors([]);
    setEmailAvailabilityError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email,
        password,
        password_confirmation: passwordConfirmation,
      };

      const response = activeTab === 'login' ? await loginUser(userData) : await registerUser(userData);

      console.log(activeTab === 'login' ? 'Login successful:' : 'Registration successful:', response);

      if (response.status === 'created' && response.logged_in) {
        // Redirect or perform any actions upon successful login or registration
        onAuthSuccess(response.data);
      } else {
        console.error(activeTab === 'login' ? 'Login failed:' : 'Registration failed:', response);
      }
    } catch (error) {
      console.error(activeTab === 'login' ? 'Login error:' : 'Registration error:', error);

      if (error.response) {
        if (error.response.data.errors) {
          setFormErrors(error.response.data.errors);
          setEmailAvailabilityError(null);
        } else {
          setFormErrors([]);
          setEmailAvailabilityError('An unexpected error occurred.');
        }
      } else {
        setFormErrors([]);
        setEmailAvailabilityError('An unexpected error occurred.');
      }
    }
  };

  const handleEmailBlur = async () => {
    try {
      const response = await checkEmailAvailability(email);
  
      if (response.available) {
        setEmailAvailabilityError(
          activeTab === 'login'
            ? 'This email is not registered. Please sign up or try a different email.'
            : null
        );
      } else {
        setEmailAvailabilityError(
          activeTab === 'login' ? 'This email is not registered. Please sign up or try a different email.' : 'This email is already taken. Please choose a different one.'
        );
      }
    } catch (error) {
      console.error('Email availability check error:', error);
      setEmailAvailabilityError('An error occurred while checking email availability. Please try again.');
    }
  };
  

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleTabClick('login')} style={{ marginRight: '10px' }}>
          Login
        </button>
        <button onClick={() => handleTabClick('register')}>Register</button>
      </div>

      <h2>{activeTab === 'login' ? 'Login' : 'Registration'}</h2>

      {/* Display form errors if any */}
      {formErrors.length > 0 && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{formErrors.join(', ')}</p>
        </div>
      )}

      {emailAvailabilityError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{emailAvailabilityError}</p>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit}>
        {/* Your form inputs */}
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {activeTab === 'register' && (
          <div>
            <label>Password Confirmation:</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit">{activeTab === 'login' ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
};

export default AuthForm;
