import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { getListingById } from '../services/api';
import ImageModal from '../components/ImageModal';
import EmailLink from '../components/EmailLink'; // Import the new component
import MediaTabs from '../components/MediaTabs'; // Import the new component

import BNHNextHomeLogo from '../assets/appartemnt logo.png'; // Import the logo

// Sub-components based on the wireframe
const Gallery = ({ images, featuredImage, onImageClick }) => {
  const otherImages = images.filter(image => image !== featuredImage);

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 h-[500px]">
      <div
        className="relative col-span-2 row-span-2 bg-cover bg-center rounded-lg cursor-pointer overflow-hidden"
        style={{ backgroundImage: `url(http://localhost:5000/${featuredImage})` }}
        onClick={() => onImageClick(`http://localhost:5000/${featuredImage}`)}
      >
        <img src={BNHNextHomeLogo} alt="Watermark" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-auto opacity-30 -rotate-45" />
      </div>
      {otherImages.map((image, index) => (
        <div
          key={index}
          className="relative bg-cover bg-center rounded-md cursor-pointer overflow-hidden"
          style={{ backgroundImage: `url(http://localhost:5000/${image})` }}
          onClick={() => onImageClick(`http://localhost:5000/${image}`)}
        >
          <img src={BNHNextHomeLogo} alt="Watermark" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-auto opacity-30 -rotate-45" />
        </div>
      ))}
    </div>
  );
};

const Video = ({ videoURL }) => {
  // Extract YouTube video ID from URL
  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoURL ? getYouTubeID(videoURL) : null;

  if (!videoId) return null; // Don't render if no valid video URL

  return (
    <div className="mt-4">
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      ></iframe>
    </div>
  );
};

const Details = ({ listing }) => (
  <aside className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="text-3xl font-extrabold mb-2">{listing.listingType === 'rent' ? `$${listing.price} / mo` : `$${listing.price}`}</div>
    <div className="flex flex-wrap gap-2 mb-4 text-sm">
      <span className="bg-gray-200 py-1 px-3 rounded-full">Bedrooms: {listing.bedrooms}</span>
      <span className="bg-gray-200 py-1 px-3 rounded-full">Bathrooms: {listing.bathrooms}</span>
      <span className="bg-gray-200 py-1 px-3 rounded-full">{listing.squareFootage} sq ft</span>
    </div>

    <div className="border-t border-gray-200 pt-4">
      <h3 className="font-bold text-xl mb-2">Address</h3>
      <p className="text-gray-700">{listing.address}</p>
    </div>

    <div className="border-t border-gray-200 pt-4 mt-4">
      <h3 className="font-bold text-xl mb-2">Description</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
    </div>

    {listing.amenities && listing.amenities.length > 0 && (
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="font-bold text-xl mb-2">Amenities</h3>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
          {listing.amenities.map((amenity, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {amenity}
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
      <strong className="font-bold text-lg">Contact an Agent</strong>
      <p className="text-gray-800 mt-1">Call Us: {listing.contactInfo.phone}</p>
      <p className="text-gray-800">Email: {listing.contactInfo.email}</p>
      <EmailLink
        email={listing.contactInfo.email}
        subject={`Visit Request for Listing: ${listing.title}`}
        body={`I would like to schedule a visit for the listing "${listing.title}".`}
      >
        <div className="block w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center">
          Schedule a Visit
        </div>
      </EmailLink>
    </div>
    <div className="mt-6 flex justify-center">
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: document.title,
              text: 'Check out this listing!',
              url: window.location.href,
            })
              .then(() => console.log('Successful share'))
              .catch((error) => console.log('Error sharing', error));
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }
        }}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full text-sm transition duration-300"
      >
        Share
      </button>
    </div>
  </aside>
);

const Map = ({ location }) => {
  if (!location || !location.lat || !location.lng) {
    return (
      <div className="mt-4 bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
        Location not available
      </div>
    );
  }

  const position = [location.lat, location.lng];

  return (
    <div className="mt-4 h-64 rounded-lg shadow-sm" style={{ height: '400px' }}>
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}></Marker>
      </MapContainer>
    </div>
  );
};

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageUrl('');
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListingById(id);
        setListing(response.data);
      } catch (err) {
        // Error handled globally
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <div>Loading listing details...</div>;
  if (!listing) return <div>Listing not found.</div>;

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <main className="mt-5">
        <h1 className="text-3xl font-bold mt-4 mb-2">{listing.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          {listing.listingType && (
            <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${listing.listingType === 'rent' ? 'bg-blue-500' : 'bg-green-500'}`}>
              {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          )}
          {listing.propertyType && (
            <span className="px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full capitalize">
              {listing.propertyType}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MediaTabs>
              <div label="Photos">
                <Gallery images={listing.images} featuredImage={listing.featuredImage} onImageClick={handleImageClick} />
              </div>
              {listing.videoURL && (
                <div label="Home Tour">
                  <Video videoURL={listing.videoURL} />
                </div>
              )}
              <div label="Property Location">
                <Map location={listing.location} />
              </div>
            </MediaTabs>
          </div>
          <Details listing={listing} />
        </div>
      </main>
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        imageUrl={selectedImageUrl}
      />
    </div>
  );
};

export default ListingDetailPage;
