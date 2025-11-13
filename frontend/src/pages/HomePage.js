import React, { useState, useEffect, useCallback } from 'react';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar'; // Import FilterBar
import { getListings } from '../services/api'; // Removed getFeaturedListings
import { useDebounce } from '../hooks/useDebounce';
import ContactModal from '../components/ContactModal';

const Hero = () => (
  <div 
    className="relative bg-cover bg-center h-screen flex items-center justify-center text-white p-4"
    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop)' }}
  >
    <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
    <div className="relative z-10 text-center">
      <h2 className="text-3xl font-bold mb-2">Discover Your Perfect Home</h2>
      <p className="text-lg mb-4">From apartments to villas, find your perfect home to rent or buy.</p>
    </div>
  </div>
);

// Consolidated Listings component
const Listings = ({ listings, loading, onLoadMore, hasMore }) => (
  <section id="all-listings">
    <h3 className="text-2xl font-bold mt-8 mb-4 text-center">Available Listings</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
      {listings.map(listing => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
    {loading && <div>Loading listings...</div>}
    {hasMore && !loading && (
      <div className="text-center mt-8">
        <button onClick={onLoadMore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Load More
        </button>
      </div>
    )}
  </section>
);

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({}); // State to hold filters from FilterBar
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedFilters = useDebounce(currentFilters, 500);

  const fetchListings = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const params = { ...debouncedFilters, page: currentPage };
      
      const response = await getListings(params);
      setListings(prev => currentPage === 1 ? response.data.listings : [...prev, ...response.data.listings]);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      // Error handled globally
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    setPage(1);
    fetchListings(1);
  }, [debouncedFilters, fetchListings]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage);
  }

  const handleApplyFilters = (filtersFromBar) => {
    setCurrentFilters(filtersFromBar);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <main className="mt-5">
      <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
      <Hero />
      <div className="mt-8 px-4"> {/* Added margin-top and horizontal padding */}
        <FilterBar onApplyFilters={handleApplyFilters} /> {/* Integrate FilterBar */}
      </div>
      <Listings listings={listings} loading={loading} onLoadMore={handleLoadMore} hasMore={page < totalPages} />
    </main>
  );
};

export default HomePage;
