import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { confirmEmail } from '../api/axios'; // Update this path

const EmailConfirmationPage = () => {
  const { token } = useParams();
  const [confirmationStatus, setConfirmationStatus] = useState(null);

  const confirmEmailRequest = async () => {
    try {
      const response = await confirmEmail(token);
      setConfirmationStatus(response.status);
    } catch (error) {
      console.error('Email confirmation error:', error);
      setConfirmationStatus('error');
    }
  };

  return (
    <div>
      {confirmationStatus === 'success' ? (
        <div>
          <h2>Email Confirmed Successfully</h2>
          <p>Your email has been successfully confirmed.</p>
        </div>
      ) : confirmationStatus === 'error' ? (
        <div>
          <h2>Email Confirmation Failed</h2>
          <p>There was an error confirming your email. Please try again or contact support.</p>
        </div>
      ) : (
        <div>
          <h2>Confirming Email...</h2>
          <p>Please wait while we confirm your email.</p>
          <button onClick={confirmEmailRequest}>Confirm Email</button>
        </div>
      )}
    </div>
  );
};

export default EmailConfirmationPage;
