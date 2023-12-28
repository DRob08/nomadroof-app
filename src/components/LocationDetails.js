import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { usePropertyContext } from '../contexts/PropertyContext';
import '../assets/styles/PropertyDetails.css';
import { loadGoogleMapsScript, getLatLngFromAddress } from '../utils/googleMaps';
import { fetchCountries,  createProperty,
    updateProperty } from '../api/axios';

const LocationDetails = ({ onPrev, onNext }) => {
  const {
    propertyState,
    setPropertyField,
    setPropertyId,
    resetProperty, // Import the resetProperty action
  } = usePropertyContext();

  const {
    property_id,
    address = '',
    city = '',
    country = '',
    zip_code = '',
    latitude,
    longitude,
  } = propertyState;

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [countries, setCountries] = useState([]);

  const autocompleteRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countriesData = await fetchCountries();
        const sortedCountries = countriesData.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const loadMaps = async () => {
      try {
        const google = await loadGoogleMapsScript();

        const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            console.error('Place details not found for input:', place.name);
            return;
          }

          const { lat, lng } = place.geometry.location;
          setPropertyField('latitude', lat());
          setPropertyField('longitude', lng());
          mapRef.current.setCenter({ lat: lat(), lng: lng() });
          mapRef.current.setZoom(15);
        });

        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: { lat: latitude ?? 25.7617, lng: longitude ?? -80.1918 },
          zoom: 15,
        });

        console.log('Map object:', mapRef.current);

        new google.maps.Marker({
          position: { lat: latitude ?? 25.7617, lng: longitude ?? -80.1918 },
          map: mapRef.current,
        });
      } catch (error) {
        console.error('Error loading Google Maps script:', error);
      }
    };

    loadMaps();
  }, [setPropertyField, latitude, longitude]);

  const handleAddressChange = async (address) => {
    setPropertyField('address', address);

    try {
      const { lat, lng } = await getLatLngFromAddress(address);
      console.log('Latitude:', lat);
      console.log('Longitude:', lng);
      setPropertyField('latitude', lat);
      setPropertyField('longitude', lng);
      mapRef.current.setCenter({ lat, lng });
      mapRef.current.setZoom(15);
    } catch (error) {
      console.error('Error getting latitude and longitude:', error);
    }
  };

  const handleInputChange = (e) => {
    setPropertyField(e.target.name, e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveMessage('');
    setErrorMessage('');

    if (!address || !city || !country || !zip_code) {
      setErrorMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      setSaveMessage('Changes saved successfully!');
      setLoading(false);

      setTimeout(() => {
        setSaveMessage('');
      }, 3000);

      // Save property data
      let response;
      if (property_id) {
        // If property_id exists, it means the property is being updated
        response = await updateProperty(property_id, propertyState);
      } else {
        // If property_id is null, it means a new property is being created
        response = await createProperty(propertyState);
        setPropertyId(response.property_id); // Update the property_id in the context
      }

      console.log('Update/Create property response:', response);

      // Reset property state after saving
      resetProperty();

      onNext();
    } catch (error) {
      console.error('Error updating/creating property:', error);
      setErrorMessage('Error saving changes. Please try again.');
      setLoading(false);

      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };

  return (
    <div className="property-details-container">
      <h3 className="section-heading">Step 2: Location Details</h3>
      <div className="message-container">
        {saveMessage && <div className="success-message">{saveMessage}</div>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </div>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                value={address}
                onChange={(e) => handleInputChange(e)}
                onBlur={(e) => handleAddressChange(e.target.value)}
                ref={autocompleteRef}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="city"
                value={city}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control
                as="select" // Use select for country dropdown
                name="country"
                value={country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.cca2} value={country.name.common}>
                    {country.name.common}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter zip code"
                name="zip_code"
                value={zip_code}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="map-container" ref={mapContainerRef}></div>

        <div className="button-container">
          <Button variant="primary" onClick={onPrev}>
            Previous
          </Button>
          <Button variant="success" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LocationDetails;
