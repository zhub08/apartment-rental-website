import React from 'react';

const PhotoGallery = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-full h-48">
          <img
            src={`http://localhost:5000/${image}`}
            alt={`Gallery image ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
