// PropertyContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Initial state for the property form
const initialState = {
  property_id: null, // New field to store the property ID
  user_id: null,
  name: '',
  description: '',
  latitude: null,
  longitude: null,
  features_and_amenities: '',
  max_guests: null,
  availability: false,
  monthly_price: null,
  weekly_price: null,
  daily_price: null,
  status: '',
  booked_start_date: null,
  booked_end_date: null,
  cat_property_id: '',
  size: '', // Provide a default value (empty string) instead of null
  bedrooms: 0, // Provide a default value (0) instead of null
  bathrooms: 0, // Provide a default value (0) instead of null
  rooms: 0, // Provide a default value (0) instead of null
 
  city_fee: 0.00, // Provide a default value (0.00) instead of null
  cleaning_fee: 0.00, // Provide a default value (0.00) instead of null
  min_months_booking: 0, // Provide a default value (0) instead of null
  extra_price_per_guest: 0.00, // Provide a default value (0.00) instead of null
  verified: false,
  country: '',
  city: '',
};

// Action types
const actionTypes = {
  SET_PROPERTY_FIELD: 'SET_PROPERTY_FIELD',
  SET_PROPERTY_ID: 'SET_PROPERTY_ID', // New action type for setting the property ID
  RESET_PROPERTY: 'RESET_PROPERTY',
};

// Reducer function
const propertyReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_PROPERTY_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case actionTypes.SET_PROPERTY_ID: // New case to handle setting the property ID
      return {
        ...state,
        property_id: action.payload.property_id,
      };
    case actionTypes.RESET_PROPERTY:
      return initialState;
    default:
      return state;
  }
};

// Context
const PropertyContext = createContext();

// PropertyProvider component
export const PropertyProvider = ({ children }) => {
  const [propertyState, dispatch] = useReducer(propertyReducer, initialState);

  const setPropertyField = (field, value) => {
    dispatch({
      type: actionTypes.SET_PROPERTY_FIELD,
      payload: { field, value },
    });
  };

  const setPropertyId = (property_id) => {
    dispatch({
      type: actionTypes.SET_PROPERTY_ID,
      payload: { property_id },
    });
  };

  const resetProperty = () => {
    dispatch({ type: actionTypes.RESET_PROPERTY });
  };

  return (
    <PropertyContext.Provider value={{ propertyState, setPropertyField, setPropertyId, resetProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};

// Custom hook to use the property context
export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};
