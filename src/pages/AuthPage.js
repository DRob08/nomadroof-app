import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Registration from '../components/auth/Registration';
import Login from '../components/auth/Login';

const AuthPage = ({ handleLogin, user, logged_in_status, handleLogout }) => {
  const navigate = useNavigate();

  // Function to handle authentication success (both registration and login)
  const handleAuthSuccess = (userData) => {
    console.log('Authentication success in AuthPage:', userData);

    // Call the handleLogin function to update login status and user data
    handleLogin(userData);

    // Redirect to the dashboard
    navigate('/dashboard');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">Authentication Page</h2>
          <Routes>
            <Route
              path="login"
              element={<Login onLoginSuccess={handleAuthSuccess} />}
            />
            <Route
              path="register"
              element={<Registration onRegistrationSuccess={handleAuthSuccess} />}
            />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;
