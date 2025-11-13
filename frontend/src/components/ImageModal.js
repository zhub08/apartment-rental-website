import React from 'react';
import BNHNextHomeLogo from '../assets/appartemnt logo.png'; // Import the logo

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged view" className="max-w-full max-h-[90vh] object-contain" />
        <img src={BNHNextHomeLogo} alt="Watermark" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-auto opacity-20 -rotate-45" />
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-white text-3xl leading-none hover:text-gray-300"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
