import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListingForm from '../components/ListingForm';
import { getListingById, updateAdminListing } from '../services/api';

const EditListingPage = () => {
  const [initialData, setInitialData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListingById(id);
        setInitialData(response.data);
      } catch (error) {
        // Error handled globally by interceptor
      }
    };
    fetchListing();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await updateAdminListing(id, formData);
      navigate('/admin/dashboard');
    } catch (error) {
      // Error handled globally by interceptor
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>
      {initialData ? (
        <ListingForm onSubmit={handleSubmit} initialData={initialData} isEdit={true} />
      ) : (
        <div>Loading form...</div>
      )}
    </div>
  );
};

export default EditListingPage;
