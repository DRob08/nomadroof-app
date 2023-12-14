import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Payment = () => {
  const [creditCard, setCreditCard] = useState('');
  const [paypalAccount, setPaypalAccount] = useState('');

  const handleCreditCardChange = (e) => {
    setCreditCard(e.target.value);
  };

  const handlePaypalAccountChange = (e) => {
    setPaypalAccount(e.target.value);
  };

  const handleAddCreditCard = () => {
    // Add logic to handle adding credit card
    console.log('Added Credit Card:', creditCard);
  };

  const handleAddPaypalAccount = () => {
    // Add logic to handle adding PayPal account
    console.log('Added PayPal Account:', paypalAccount);
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={12} style={{ padding: '20px' }}>
          <h1>Payment Methods</h1>

          <Form>
            <Form.Group controlId="formCreditCard">
              <Form.Label>Add Credit Card</Form.Label>
              <Form.Control
                type="text"
                placeholder="Credit Card Number"
                value={creditCard}
                onChange={handleCreditCardChange}
              />
              <Button variant="primary" onClick={handleAddCreditCard}>
                Add Credit Card
              </Button>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group controlId="formPaypalAccount">
              <Form.Label>Add PayPal Account</Form.Label>
              <Form.Control
                type="text"
                placeholder="PayPal Email"
                value={paypalAccount}
                onChange={handlePaypalAccountChange}
              />
              <Button variant="primary" onClick={handleAddPaypalAccount}>
                Add PayPal Account
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
