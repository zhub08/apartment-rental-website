import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAdminListings, deleteAdminListing } from '../services/api';
import Modal from '../components/Modal'; // Import the Modal component

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDeleteId, setListingToDeleteId] = useState(null);

  const fetchListings = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await getAdminListings({ page, limit: itemsPerPage });
      setListings(response.data.listings);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      // Error handled globally
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchListings(currentPage);
  }, [currentPage, fetchListings]);

  const handleDeleteClick = (id) => {
    setListingToDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (listingToDeleteId) {
      try {
        await deleteAdminListing(listingToDeleteId);
        fetchListings(currentPage);
        setShowDeleteModal(false);
        setListingToDeleteId(null);
      } catch (err) {
        // Error handled globally
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setListingToDeleteId(null);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Listing
        </Link>
      </div>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-center">Price</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {listings.map(listing => (
              <tr key={listing._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{listing.title}</td>
                <td className="py-3 px-6 text-left">{listing.address}</td>
                <td className="py-3 px-6 text-center">${listing.price}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link to={`/admin/edit/${listing._id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                      {/* Edit Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
                      </svg>
                    </Link>
                    <button onClick={() => handleDeleteClick(listing._id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                      {/* Delete Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title="Confirm Delete"
      >
        Are you sure you want to delete this listing? This action cannot be undone.
      </Modal>
    </div>
  );
};

export default AdminDashboard;
