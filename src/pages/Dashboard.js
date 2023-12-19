import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import Payment from '../components/Payment';
import AuthChecker from '../components/AuthChecker';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ logged_in_status, user }) => {
  const [selectedNavItem, setSelectedNavItem] = useState('profile');
  const userRole = user && user.role;
  const navigate = useNavigate();

  const handleNavItemClick = (item) => {
    setSelectedNavItem(item);

    // Redirect to the appropriate page when clicking "Add Property"
    if (item === 'addProperty') {
      navigate('/add-property');
    }
  };

  useEffect(() => {
    setSelectedNavItem('profile');
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col sm={2} style={{ background: '#f0f0f0', minHeight: '100vh' }}>
          <h1>Dashboard</h1>
          <p
            onClick={() => handleNavItemClick('profile')}
            style={{ cursor: selectedNavItem === 'profile' ? 'default' : 'pointer' }}
          >
            Profile
          </p>
          <p
            onClick={() => handleNavItemClick('payment')}
            style={{ cursor: selectedNavItem === 'payment' ? 'default' : 'pointer' }}
          >
            Payment Methods
          </p>

          {/* Conditional rendering for "Add Property" link based on user role */}
          {(userRole === 'admin' || userRole === 'host') && (
            <p
              onClick={() => handleNavItemClick('addProperty')}
              style={{ cursor: selectedNavItem === 'addProperty' ? 'default' : 'pointer' }}
            >
              Add Property
            </p>
          )}
          {/* Add more sidebar content as needed */}
        </Col>

        <Col sm={10} style={{ padding: '20px', boxSizing: 'border-box' }}>
          <h2>Main Content</h2>

          {selectedNavItem === 'profile' && <UserProfile />}
          {selectedNavItem === 'payment' && <Payment />}
          {/* Add more components for other nav items as needed */}
        </Col>
      </Row>
    </Container>
  );
};

export default AuthChecker(Dashboard);
