// PropertyDetails.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { fetchCategories, createProperty } from '../api/axios';

const PropertyDetails = ({ onNext, onSave }) => {
  const [property, setProperty] = useState({
    name: '',
    description: '',
    cat_property_id: '',
  });

  const [categories, setCategories] = useState([]);

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

  const handleInputChange = (e) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!property.name || !property.description || !property.cat_property_id) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      // Make the API call to create a new property
      const response = await createProperty(property);
      console.log('Response:', response);
  
      // Check the success field to determine success
      if (response && response.success) {
        const createdProperty = response.property;
        console.log('Property created successfully!', createdProperty);
  
        // Additional logic for saving data without proceeding to the next step
        onSave();
  
        // Move to the next step or handle the success as needed
        onNext();
      } else {
        // Handle unsuccessful response and validation errors
        if (response && response.errors) {
          const errors = response.errors;
          // Handle validation errors, e.g., display them to the user
          console.error('Validation errors:', errors);
          alert(`Validation errors: ${errors.join(', ')}`);
        } else {
          // Handle other errors
          alert('Error creating property. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error creating property:', error);
      // Handle errors as needed
      alert('Error creating property. Please try again.');
    }
  };
  
  

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Step 1: Property Details</h3>

      <Form>
        <Form.Group controlId="propertyName">
          <Form.Label>Property Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter property name"
            name="name"
            value={property.name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="propertyDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter property description"
            name="description"
            value={property.description}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="propertyCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="cat_property_id"
            value={property.cat_property_id}
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

        <div style={{ marginTop: '10px' }}>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PropertyDetails;
