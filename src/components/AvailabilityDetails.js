// src/components/AvailabilityDetails.js
import React from 'react';

const AvailabilityDetails = ({ onPrev, onFinish }) => {
  return (
    <div>
      <h3>Step 4: Availability Details</h3>
      {/* Add your availability details form here */}
      <button onClick={onPrev}>Previous</button>
      <button onClick={onFinish}>Finish</button>
    </div>
  );
};

export default AvailabilityDetails;
