import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { registerUser, checkEmailAvailability } from '../../api/axios';

const Registration = ({ onRegistrationSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [country, setCountry] = useState('');
  const [registrationErrors, setRegistrationErrors] = useState([]);
  const [generalError, setGeneralError] = useState(null);
  const [emailAvailabilityError, setEmailAvailabilityError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        password_confirmation: passwordConfirmation,
        country,
      };

      const response = await registerUser(userData);

      console.log('Registration successful:', response);

      if (response.status === 'created') {
        onRegistrationSuccess(response.user);
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        if (error.response.data.errors) {
          setRegistrationErrors(error.response.data.errors);

          const emailTakenError = error.response.data.errors.find(
            (errMsg) => errMsg === 'Email has already been taken'
          );

          const passwordMismatchError = error.response.data.errors.find(
            (errMsg) => errMsg === "Password confirmation doesn't match Password"
          );

          if (emailTakenError) {
            setGeneralError(emailTakenError);
          } else if (passwordMismatchError) {
            setGeneralError(passwordMismatchError);
          } else {
            setGeneralError('Registration failed. Please fix the following errors:');
          }
        } else {
          setRegistrationErrors([]);
          setGeneralError('An unexpected error occurred during registration.');
        }
      } else {
        setRegistrationErrors([]);
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleEmailBlur = async () => {
    try {
      const response = await checkEmailAvailability(email);

      if (response.available) {
        setEmailAvailabilityError(null);
      } else {
        setEmailAvailabilityError('This email is already taken. Please choose a different one.');
      }
    } catch (error) {
      console.error('Email availability check error:', error);
      setEmailAvailabilityError('An error occurred while checking email availability. Please try again.');
    }
  };

  return (
    <div>
      <h2>Registration</h2>

      {generalError && <Alert variant="danger">{generalError}</Alert>}

      {registrationErrors.length > 0 && (
        <Alert variant="danger">
          {generalError}
          <ul>
            {registrationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {emailAvailabilityError && (
        <Alert variant="danger">{emailAvailabilityError}</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPasswordConfirmation">
          <Form.Label>Password Confirmation</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicCountry">
          <Form.Label>Country of Origin</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>

        {/* "Continue with Facebook" button */}
        <Button variant="primary" className="ml-2">
          Continue with Facebook
        </Button>

        {/* "Continue with Google" button */}
        <Button variant="danger" className="ml-2">
          Continue with Google
        </Button>
      </Form>
    </div>
  );
};

export default Registration;
