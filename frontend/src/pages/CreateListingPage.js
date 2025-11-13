import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm';
import { createAdminListing } from '../services/api';

const CreateListingPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createAdminListing(formData);
      navigate('/admin/dashboard');
    } catch (error) {
      // Error handled globally by interceptor
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      <ListingForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateListingPage;
