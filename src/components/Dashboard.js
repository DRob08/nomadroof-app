import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Card, Form, Button } from 'react-bootstrap';
import AuthChecker from './AuthChecker';
import { checkAuthentication } from '../api/axios';

const Dashboard = ({ logged_in_status }) => {
  const [emailNotAuthenticated, setEmailNotAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const checkEmailAuthentication = async () => {
      try {
        const response = await checkAuthentication();
        const user = response.user;

        // Check if confirmation_token indicates email not authenticated
        const isEmailNotAuthenticated = user.confirmation_token !== null;
        setEmailNotAuthenticated(isEmailNotAuthenticated);

        // Set user details
        setUserDetails({
          firstName: user.first_name,
          lastName: user.last_name,
          country: user.country_of_origin,
          email: user.email,
        });
      } catch (error) {
        console.error('Error checking email authentication:', error);
      }
    };

    checkEmailAuthentication();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col sm={3} style={{ background: '#f0f0f0', padding: '20px' }}>
          <Card>
            <Card.Body>
              <Card.Title>Sidebar</Card.Title>
              <Card.Text>
                {/* Add more sidebar content as needed */}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={9} style={{ padding: '20px' }}>
          <h1>Dashboard</h1>

          {/* Display message if email not authenticated */}
          {emailNotAuthenticated && (
            <Alert variant="warning">
              Your email is not yet authenticated. Please check your email and confirm your account.
            </Alert>
          )}

          <Card>
            <Card.Body>
              <Card.Title>Main Content</Card.Title>
              <Card.Text>This is the main content of the dashboard.</Card.Text>

              {/* Display user details */}
              <p>Logged In: {logged_in_status ? 'Yes' : 'No'}</p>
              <p>First Name: {userDetails.firstName}</p>
              <p>Last Name: {userDetails.lastName}</p>
              <p>Country: {userDetails.country}</p>
              <p>Email: {userDetails.email}</p>

              {/* Profile Image Upload Form */}
              <Form>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Upload Profile Image</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthChecker(Dashboard);
