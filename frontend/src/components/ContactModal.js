import React from 'react';
import EmailLink from './EmailLink'; // Import the new component

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="mb-2">For all inquiries regarding renting or buying, please contact our main office:</p>
        <div className="bg-gray-100 p-4 rounded-md">
          <p><strong>Phone:</strong> <a href="tel:+25192391343" className="text-blue-600 hover:underline">(+251) 92391343</a></p>
          <p><strong>Phone:</strong> <a href="tel:+251924498797" className="text-blue-600 hover:underline">(+251) 924498797</a></p>
          <div><strong>Email:</strong> <EmailLink email="habatmu.desta.h@gmail.com" /></div>
          <div><strong>Email:</strong> <EmailLink email="adco.biruk@gmail.com" /></div>
        </div>
        <button 
          onClick={onClose} 
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
