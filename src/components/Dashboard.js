import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Card, Form, Button, Nav } from 'react-bootstrap';
import AuthChecker from './AuthChecker';
import { checkAuthentication, updateUser } from '../api/axios';

const Dashboard = ({ logged_in_status }) => {
  const [emailNotAuthenticated, setEmailNotAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    country_of_origin: '',
    first_name: '',
    last_name: '',
    whatsapp_number: '',
    languages_spoken: '',
    about_me: '',
    dob: '',
    instagram_handle: '',
    twitter_handle: '',
    linkedin_handle: '',
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkEmailAuthentication = async () => {
      try {
        const response = await checkAuthentication();
        const user = response.user;

        // Check if confirmation_token indicates email not authenticated
        const isEmailNotAuthenticated = user.confirmation_token !== null;
        setEmailNotAuthenticated(isEmailNotAuthenticated);

        // Set userEmail
        setUserEmail(user.email || '');

        // Set user details
        setUserDetails({
          country_of_origin: user.country_of_origin,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          whatsapp_number: user.whatsapp_number || '',
          languages_spoken: user.languages_spoken || '',
          about_me: user.about_me || '',
          dob: user.dob || '',
          instagram_handle: user.instagram_handle || '',
          twitter_handle: user.twitter_handle || '',
          linkedin_handle: user.linkedin_handle || '',
        });
      } catch (error) {
        console.error('Error checking email authentication:', error);
      }
    };

    checkEmailAuthentication();
  }, []);

  const handleFieldChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value !== undefined ? value : '',
    }));
  };

  const handleSaveClick = async () => {
    try {
      // Call the updateUser function with the updated user data
      const response = await updateUser(userDetails);
      // Check if the API call was successful
      if (response && response.message) {
        // Display success message to the user
        setSuccessMessage(response.message);
        // Optionally, you can clear any previous error messages
        setErrorMessage(null);
      } else {
        // Handle the case where the response is not as expected
        console.error('Unexpected response from the API:', response);
        // Display an error message to the user
        setErrorMessage('An unexpected error occurred while updating the profile.');
        // Optionally, you can clear any previous success messages
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);

      // Display the exact error message returned from the API
      if (error.response && error.response.data && error.response.data.error && error.response.data.errors) {
        const errorTitle = error.response.data.error;
        const errorDetails = error.response.data.errors;
        setErrorMessage(`${errorTitle}: ${errorDetails}`);
      } else {
        setErrorMessage('Failed to update profile. Please try again.');
      }

      // Optionally, you can clear any previous success messages
      setSuccessMessage(null);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={3} style={{ background: '#f0f0f0', padding: '20px' }}>
          <Card>
            <Card.Body>
              <Card.Title>Sidebar</Card.Title>
              <Nav defaultActiveKey="/profile" className="flex-column">
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/payment">Payment Methods</Nav.Link>
              </Nav>
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

              {/* Display success message */}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}

              {/* Display error message */}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              {/* Display user details */}
              <p>Logged In: {logged_in_status ? 'Yes' : 'No'}</p>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.first_name || ''}
                        onChange={(e) => handleFieldChange('first_name', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.last_name || ''}
                        onChange={(e) => handleFieldChange('last_name', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formCountry">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.country_of_origin || ''}
                        onChange={(e) => handleFieldChange('country_of_origin', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        readOnly
                        value={userEmail || ''}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="formWhatsAppNumber">
                      <Form.Label>WhatsApp Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.whatsapp_number || ''}
                        onChange={(e) => handleFieldChange('whatsapp_number', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formLanguagesSpoken">
                      <Form.Label>Languages Spoken</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.languages_spoken || ''}
                        onChange={(e) => handleFieldChange('languages_spoken', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formAboutMe">
                      <Form.Label>About Me</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={userDetails.about_me || ''}
                        onChange={(e) => handleFieldChange('about_me', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDOB">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        value={userDetails.dob || ''}
                        onChange={(e) => handleFieldChange('dob', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formInstagramHandle">
                      <Form.Label>Instagram Handle</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.instagram_handle || ''}
                        onChange={(e) => handleFieldChange('instagram_handle', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formTwitterHandle">
                      <Form.Label>Twitter Handle</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.twitter_handle || ''}
                        onChange={(e) => handleFieldChange('twitter_handle', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formLinkedInHandle">
                      <Form.Label>LinkedIn Handle</Form.Label>
                      <Form.Control
                        type="text"
                        value={userDetails.linkedin_handle || ''}
                        onChange={(e) => handleFieldChange('linkedin_handle', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Save button */}
                <Button variant="primary" onClick={handleSaveClick}>
                  Save Changes
                </Button>
              </Form>

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
