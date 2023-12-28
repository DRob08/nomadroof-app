// src/utils/googleMaps.js

let googleMapsPromise;

export const loadGoogleMapsScript = () => {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    console.log('Google Maps API Key:', apiKey);

    if (!apiKey) {
      console.error('Google Maps API key not found.');
      reject(new Error('Google Maps API key not found.'));
      return;
    }

    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    googleMapsScript.async = true;
    googleMapsScript.onload = () => resolve(window.google);
    googleMapsScript.onerror = (error) => reject(error);

    document.head.appendChild(googleMapsScript);
  });

  return googleMapsPromise;
};


  export const getLatLngFromAddress = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
  
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          const location = results[0].geometry.location;
          const latLng = { lat: location.lat(), lng: location.lng() };
          resolve(latLng);
        } else {
          reject(new Error(`Geocode was not successful for the following reason: ${status}`));
        }
      });
    });
  };
  