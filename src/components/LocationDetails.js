import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { usePropertyContext } from '../contexts/PropertyContext';
import '../assets/styles/PropertyDetails.css';
import { loadGoogleMapsScript, getLatLngFromAddress } from '../utils/googleMaps';
import { fetchCountries, createProperty, updateProperty } from '../api/axios';

const LocationDetails = ({ onPrev, onNext }) => {
  const {
    propertyState,
    setPropertyField,
    setPropertyId,
    resetProperty,
  } = usePropertyContext();

  const {
    property_id,
    property_address = '',
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
        const sortedCountries = countriesData.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
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

        const autocomplete = new google.maps.places.Autocomplete(
          autocompleteRef.current
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            console.error('Place details not found for input:', place.name);
            return;
          }

          console.log('Place object:', place.address_components);

          // Get the city, country, and zip code components

          const streetNumberComponent = place.address_components.find((component) =>
            component.types.includes('street_number')
          );

          const routeComponent = place.address_components.find((component) =>
            component.types.includes('route')
          );

          const neighborhoodComponent = place.address_components.find((component) =>
            component.types.includes('neighborhood')
          );

          const cityComponent = place.address_components.find((component) =>
            component.types.includes('locality')
          );
          const countryComponent = place.address_components.find(
            (component) => component.types.includes('country')
          );
          const zipCodeComponent = place.address_components.find(
            (component) => component.types.includes('postal_code')
          );


          //console.log('Neighborhood: ', neighborhoodComponent?.long_name || '');

          const components = {
            streetNumber: place.address_components.find((component) =>
              component.types.includes('street_number')
            ),
            route: place.address_components.find((component) =>
              component.types.includes('route')
            ),
            neighborhood: place.address_components.find((component) =>
              component.types.includes('neighborhood')
            ),
            city: place.address_components.find((component) =>
              component.types.includes('locality')
            ),
            county: place.address_components.find((component) =>
              component.types.includes('administrative_area_level_2')
            ),
            state: place.address_components.find((component) =>
              component.types.includes('administrative_area_level_1')
            ),
            country: place.address_components.find((component) =>
              component.types.includes('country')
            ),
            zipCode: place.address_components.find((component) =>
              component.types.includes('postal_code')
            ),
          };
          
          // Now you can access specific components like:
          const streetNumber = components.streetNumber?.long_name || '';
          const route = components.route?.long_name || '';
          const city = components.city?.long_name || '';
          const country = components.country?.long_name || '';
          const zipCode = components.zipCode?.long_name || '';
          const county = components.county?.long_name || '';
          const neighborhood = components.neighborhood?.long_name || '';
          // ... and so on for other components

           // Console log the properties
            console.log('Street Number:', streetNumber);
            console.log('Route:', route);
            console.log('City:', city);
            console.log('Country:', country);
            console.log('Zip Code:', zipCode);
            console.log('Neighborhood:', neighborhood);
            console.log('County:', county);
          

          // Update the corresponding form fields
          setPropertyField('city', cityComponent ? cityComponent.long_name : '');
          setPropertyField(
            'country',
            countryComponent ? countryComponent.long_name : ''
          );
          setPropertyField(
            'zip_code',
            zipCodeComponent ? zipCodeComponent.long_name : ''
          );

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

       // console.log('Map object:', mapRef.current);

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
    setPropertyField('property_address', address);
    

    try {
      if (address.length > 0) {
        const { lat, lng } = await getLatLngFromAddress(address);
        console.log('Latitude:', lat);
        console.log('Longitude:', lng);
        setPropertyField('latitude', lat);
        setPropertyField('longitude', lng);
        setPropertyField('property_address', address);
        mapRef.current.setCenter({ lat, lng });
        mapRef.current.setZoom(15);
      } else {
        console.warn('Address is empty. Skipping geocoding.');
      }
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

    if (!property_address || !city || !country || !zip_code) {
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

      let response;
      if (property_id) {
        response = await updateProperty(property_id, propertyState);
      } else {
        response = await createProperty(propertyState);
        setPropertyId(response.property_id);
      }

      console.log('Update/Create property response:', response);

      //resetProperty();

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
                name="property_address"
                value={property_address}
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
                as="select"
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
