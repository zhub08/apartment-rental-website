import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const imageUrl = listing.featuredImage
    ? `http://localhost:5000/${listing.featuredImage}`
    : (listing.images && listing.images.length > 0
        ? `http://localhost:5000/${listing.images[0]}`
        : 'https://via.placeholder.com/260x150'); // Placeholder image

  return (
    <Link to={`/listings/${listing._id}`} className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 block">
      {listing.listingType && (
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded ${listing.listingType === 'rent' ? 'bg-blue-500' : 'bg-green-500'}`}>
          {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
        </div>
      )}
      <div 
        className="bg-cover bg-center h-40"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Image will be background of this div */}
      </div>
      <div className="p-4">
        <h3 className="font-bold truncate text-lg">{listing.title}</h3>
        {listing.propertyType && <p className="text-sm text-gray-500 capitalize mb-1">{listing.propertyType}</p>}
        <p className="text-gray-700 text-base">${listing.price} {listing.listingType === 'rent' && '/ month'}</p>
      </div>
    </Link>
  );
};

export default ListingCard;
