import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import {  logout } from '../../api/axios';

const NavBar = ({ userLoggedInStatus, handleLogout }) => {
  const navigate = useNavigate();

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
    <Navbar bg="dark" variant="dark">
      <Container>
        {/* Logo on the left */}
        <Navbar.Brand as={Link} to="/">
          Your Logo
        </Navbar.Brand>

        {/* Centered links */}
        <Nav className="mx-auto">
          <Nav.Link as={Link} to="/link1">
            Link 1
          </Nav.Link>
          <Nav.Link as={Link} to="/link2">
            Link 2
          </Nav.Link>
          <Nav.Link as={Link} to="/link3">
            Link 3
          </Nav.Link>
        </Nav>

        {/* Conditional rendering based on user authentication status */}
        <Nav>
          {userLoggedInStatus ? (
            // Display Logout button when user is logged in
            <Nav.Item>
              <Button variant="outline-light" onClick={handleLogoutClick}>
                Logout
              </Button>
            </Nav.Item>
          ) : (
            // Display Login and Register buttons when user is not logged in
            <>
              <Nav.Item>
                <Button variant="outline-light" as={Link} to="/auth/login">
                  Login
                </Button>
              </Nav.Item>
              <Nav.Item>
                <Button variant="outline-light" as={Link} to="/auth/register">
                  Register
                </Button>
              </Nav.Item>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
