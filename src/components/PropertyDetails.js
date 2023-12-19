import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { fetchCategories } from '../api/axios';

const PropertyDetails = ({ onUpdate }) => {
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
          <Button variant="success" onClick={() => onUpdate(property)}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PropertyDetails;
