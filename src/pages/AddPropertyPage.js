// AddPropertyPage.js
import React, { useState } from 'react';
import { Container, Col, Button } from 'react-bootstrap';
import PropertyDetails from '../components/PropertyDetails';
import LocationDetails from '../components/LocationDetails';
import ImageUpload from '../components/ImageUpload';
import AvailabilityDetails from '../components/AvailabilityDetails';
import { createProperty } from '../api/axios'; // Update this path
import { PropertyProvider } from '../contexts/PropertyContext'; // Update the path

const AddPropertyPage = () => {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    name: '',
    description: '',
    cat_property_id: '',
    size: '',
    bedrooms: 0,
    bathrooms: 0,
    rooms: 0,
    monthly_price: 0,
    city_fees: 0.00,
    cleaning_fees: 0.00,
    min_months_booking: 0,
    price_per_extra_guest: 0.00,
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

  const handleSave = () => {
    // Additional logic for saving data without proceeding to the next step
    console.log('Saving data without moving to the next step:', propertyData);
  };

  return (
    <PropertyProvider>
      <Container fluid>
        <Col sm={8} className="mx-auto" style={{ padding: '20px', boxSizing: 'border-box', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Add New Property</h2>

          {/* Render all steps and conditionally show/hide based on the current step */}
        {step === 1 && <PropertyDetails onNext={handleNext} onSave={handleSave} onUpdate={handleUpdate} />}
        {step === 2 && <LocationDetails onPrev={handlePrev} onNext={handleNext} onSave={handleSave} onUpdate={handleUpdate} />}
          {/* Add other steps similarly */}
        {step === 3 && <ImageUpload onPrev={handlePrev} onNext={handleNext} onSave={handleSave} onUpdate={handleUpdate} />}
        {step === 4 && <AvailabilityDetails onPrev={handlePrev} onFinish={handleFinish} onSave={handleSave} onUpdate={handleUpdate} />}

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
    </PropertyProvider>
  );
};

export default AddPropertyPage;
