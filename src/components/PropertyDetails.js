// PropertyDetails.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import {
  fetchCategories,
  createProperty,
  updateProperty
} from '../api/axios';
import { usePropertyContext } from '../contexts/PropertyContext';
import '../assets/styles/PropertyDetails.css'; // Adjust the path based on your project structure

const PropertyDetails = ({ onNext, onSave }) => {
  const {
    propertyState,
    setPropertyField,
    setPropertyId
  } = usePropertyContext();

  const {
    property_id,
    name,
    description,
    cat_property_id,
    size,
    bedrooms,
    bathrooms,
    rooms,
    monthly_price,
    city_fee,
    cleaning_fee,
    min_booking_months,
    extra_price_per_guest
  } = propertyState;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleInputChange = (e) => {
    setPropertyField(e.target.name, e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveMessage('');
    setErrorMessage('');

    if (!name || !description || !cat_property_id) {
      setErrorMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Log the propertyState just before making the API call
    console.log('Property State before API call:', propertyState);

    try {
      let response;

      if (property_id) {
        response = await updateProperty(property_id, propertyState);
      } else {
        response = await createProperty(propertyState);
      }

      if (response && response.success) {
        const updatedOrCreatedProperty = response.property;
        setSaveMessage('Changes saved successfully!');
        setLoading(false);

        setTimeout(() => {
          setSaveMessage('');
        }, 3000);

        setPropertyId(updatedOrCreatedProperty.id);
        onSave();
      } else {
        const errorMessage = response.data ? response.data.errors.join(', ') : 'Unknown error occurred.';
        setErrorMessage(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating/updating property:', error);

      const errorMessages = error?.response?.data?.errors || [];
      const errorMessage =
        errorMessages.length > 0 ? mapErrorMessage(errorMessages[0]) : 'Error saving changes. Please try again.';
      setErrorMessage(errorMessage);
      setLoading(false);

      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };

  const mapErrorMessage = (error) => {
    if (error.includes('Name has already been taken')) {
      return 'Property name is already taken.';
    }
    return error;
  };

  return (
    <div className="property-details-container">
      <h3 className="section-heading">Step 1: Property Details</h3>
      <div className="message-container">
        {saveMessage && <div className="success-message">{saveMessage}</div>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </div>
      <Form>
        <Row>
          {/* Column 1 */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Property Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter property name"
                name="name"
                value={name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter property description"
                name="description"
                value={description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="cat_property_id"
                value={cat_property_id}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          {/* Column 2 */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Size (sq feet)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter property size"
                name="size"
                value={size}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Bedrooms</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of bedrooms"
                name="bedrooms"
                value={bedrooms}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Bathrooms</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of bathrooms"
                name="bathrooms"
                value={bathrooms}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Rooms</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of rooms"
                name="rooms"
                value={rooms}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price per Month</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price per month"
                name="monthly_price"
                value={monthly_price}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>City Fees</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter city fees"
                name="city_fee"
                value={city_fee}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Cleaning Fee</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter cleaning fees"
                name="cleaning_fee"
                value={cleaning_fee}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Minimum Months of Booking</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter minimum months of booking"
                name="min_booking_months"
                value={min_booking_months}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price per Extra Guest</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price per extra guest"
                name="extra_price_per_guest"
                value={extra_price_per_guest}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="button-container">
          <Button variant="success" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PropertyDetails;
