// AddPropertyPage.js
import React, { useState } from 'react';
import { Container, Col, Button } from 'react-bootstrap';
import PropertyDetails from '../components/PropertyDetails';
import LocationDetails from '../components/LocationDetails';
import ImageUpload from '../components/ImageUpload';
import AvailabilityDetails from '../components/AvailabilityDetails';
import { createProperty } from '../api/axios'; // Update this path

const AddPropertyPage = () => {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    name: '',
    description: '',
    cat_property_id: '',
    // Add other fields as needed
  });

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleFinish = async () => {
    try {
      // Make the API call to create a new property
      const response = await createProperty(propertyData);

      // Handle the response as needed
      console.log('Property created successfully!', response);

      // Add additional logic if needed

    } catch (error) {
      console.error('Error creating property:', error);
      // Handle errors as needed
    }
  };

  const handleUpdate = (updatedData) => {
    console.log('Updated data:', updatedData);
    setPropertyData((prevData) => ({ ...prevData, ...updatedData }));
  };

  return (
    <Container fluid>
      <Col sm={8} className="mx-auto" style={{ padding: '20px', boxSizing: 'border-box', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Add New Property</h2>

        {/* Render the components based on the current step */}
        {step === 1 && <PropertyDetails onNext={handleNext} onUpdate={handleUpdate} />}
        {step === 2 && <LocationDetails onPrev={handlePrev} onNext={handleNext} onUpdate={handleUpdate} />}
        {step === 3 && <ImageUpload onPrev={handlePrev} onNext={handleNext} onUpdate={handleUpdate} />}
        {step === 4 && <AvailabilityDetails onPrev={handlePrev} onFinish={handleFinish} onUpdate={handleUpdate} />}

        {/* Render navigation buttons */}
        {step !== 1 && (
          <Button variant="outline-primary" onClick={handlePrev} style={{ marginRight: '10px' }}>
            Previous
          </Button>
        )}
        {step !== 4 ? (
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="success" onClick={handleFinish}>
            Finish
          </Button>
        )}
      </Col>
    </Container>
  );
};

export default AddPropertyPage;
