// src/components/ImageUpload.js
import React from 'react';

const ImageUpload = ({ onPrev, onNext }) => {
  return (
    <div>
      <h3>Step 3: Image Upload</h3>
      {/* Add your image upload form here */}
      <button onClick={onPrev}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default ImageUpload;
