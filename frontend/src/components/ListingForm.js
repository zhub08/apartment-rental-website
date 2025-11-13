import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function ListingForm({ onSubmit, initialData = {}, isEdit = false }) {
  const [listing, setListing] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    currency: 'USD',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    propertyType: 'apartment',
    listingType: 'rent',
    amenities: '',
    videoURL: '',
    contactInfo: { name: '', email: '', phone: '' }
  });
  const [newFiles, setNewFiles] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [map, setMap] = useState(null);

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setListing(prev => ({ ...prev, location: e.latlng }));
        map.flyTo(e.latlng, map.getZoom());
        // Reverse geocode to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setListing(prev => ({ ...prev, address: data.display_name }));
            }
          });
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`);
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
      setPosition(newPos);
      setListing(prev => ({ ...prev, location: newPos, address: data[0].display_name }));
      if (map) {
        map.flyTo(newPos, 13);
      }
    } else {
      alert('Location not found');
    }
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const data = {
        ...initialData,
        amenities: Array.isArray(initialData.amenities) ? initialData.amenities.join(', ') : (initialData.amenities || '')
      };
      setListing(data);
      if (data.featuredImage) {
        setFeaturedImage(data.featuredImage);
      }
      if (data.location && data.location.lat && data.location.lng) {
        setPosition(data.location);
      }
    }
  }, [initialData]);

  const handleRemoveExistingImage = (imagePath) => {
    setListing(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imagePath)
    }));
    if (featuredImage === imagePath) {
      setFeaturedImage(listing.images.length > 1 ? listing.images.find(img => img !== imagePath) : null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [outer, inner] = name.split('.');
      setListing(prev => ({ ...prev, [outer]: { ...(prev[outer] || {}), [inner]: value } }));
    } else {
      setListing(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    if (selectedFiles.length > 0 && !featuredImage) {
      setFeaturedImage(selectedFiles[0].name);
    }
  };

  const removeNewFile = (fileName) => {
    setNewFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    if (featuredImage === fileName) {
      setFeaturedImage(newFiles.length > 1 ? newFiles.find(file => file.name !== fileName)?.name : null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const processedListing = {
        ...listing,
        amenities: typeof listing.amenities === 'string' ? listing.amenities.split(',').map(s => s.trim()) : listing.amenities,
        featuredImage: featuredImage,
    };
    formData.append('listing', JSON.stringify(processedListing));
    
    if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i++) {
          formData.append('images', newFiles[i]);
        }
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Column 1 */}
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input id="title" name="title" value={listing.title || ''} onChange={handleChange} placeholder="Title" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required autoComplete="off" />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea id="description" name="description" value={listing.description || ''} onChange={handleChange} placeholder="Description" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-32" required autoComplete="off" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Location on Map</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
            <button onClick={handleSearch} type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Search
            </button>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <MapContainer ref={setMap} center={position || [9.03, 38.74]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>
          {listing.address && <p className="text-sm text-gray-600 mt-2">Selected Address: {listing.address}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price</label>
            <input id="price" name="price" type="number" value={listing.price || ''} onChange={handleChange} placeholder="Price" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required autoComplete="off" />
          </div>
          <div>
            <label htmlFor="currency" className="block text-gray-700 text-sm font-bold mb-2">Currency</label>
            <select id="currency" name="currency" value={listing.currency || 'USD'} onChange={handleChange} className="shadow appearance-none border rounded py-2 px-3 text-gray-700" autoComplete="off">
              <option value="USD">USD</option>
              <option value="ETB">ETB</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-bold mb-2">Bedrooms</label>
          <input id="bedrooms" name="bedrooms" type="number" value={listing.bedrooms || ''} onChange={handleChange} placeholder="Bedrooms" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required autoComplete="off" />
        </div>
        <div>
          <label htmlFor="bathrooms" className="block text-gray-700 text-sm font-bold mb-2">Bathrooms</label>
          <input id="bathrooms" name="bathrooms" type="number" value={listing.bathrooms || ''} onChange={handleChange} placeholder="Bathrooms" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required autoComplete="off" />
        </div>
        <div>
          <label htmlFor="squareFootage" className="block text-gray-700 text-sm font-bold mb-2">Square Footage</label>
          <input id="squareFootage" name="squareFootage" type="number" value={listing.squareFootage || ''} onChange={handleChange} placeholder="Square Footage" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" autoComplete="off" />
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="propertyType" className="block text-gray-700 text-sm font-bold mb-2">Property Type</label>
          <select id="propertyType" name="propertyType" value={listing.propertyType || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required autoComplete="off">
            <option value="">Select Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
          </select>
        </div>
        <div>
          <label htmlFor="listingType" className="block text-gray-700 text-sm font-bold mb-2">Listing Type</label>
          <select id="listingType" name="listingType" value={listing.listingType || ''} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required autoComplete="off">
            <option value="">Select Listing Type</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
        <div>
          <label htmlFor="amenities" className="block text-gray-700 text-sm font-bold mb-2">Amenities (comma-separated)</label>
          <input id="amenities" name="amenities" value={listing.amenities || ''} onChange={handleChange} placeholder="Amenities (comma-separated)" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" autoComplete="off" />
        </div>
        <div>
          <label htmlFor="videoURL" className="block text-gray-700 text-sm font-bold mb-2">YouTube Video URL</label>
          <input id="videoURL" name="videoURL" value={listing.videoURL || ''} onChange={handleChange} placeholder="YouTube Video URL" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" autoComplete="url" />
        </div>
        
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Contact Info</h3>
          <div>
            <label htmlFor="contactName" className="block text-gray-700 text-sm font-bold mb-2">Contact Name</label>
            <input id="contactName" name="contactInfo.name" value={listing.contactInfo?.name || ''} onChange={handleChange} placeholder="Contact Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2" required autoComplete="name" />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-gray-700 text-sm font-bold mb-2">Contact Email</label>
            <input id="contactEmail" name="contactInfo.email" type="email" value={listing.contactInfo?.email || ''} onChange={handleChange} placeholder="Contact Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2" required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-gray-700 text-sm font-bold mb-2">Contact Phone</label>
            <input id="contactPhone" name="contactInfo.phone" value={listing.contactInfo?.phone || ''} onChange={handleChange} placeholder="Contact Phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" autoComplete="tel" />
          </div>
        </div>

        <div className="border p-4 rounded">
            <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
            
            {/* Existing Images */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {listing.images && listing.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={`http://localhost:5000/${image}`}
                    alt={`existing preview ${index}`}
                    className={`w-full h-24 object-cover rounded-md ${featuredImage === image ? 'ring-2 ring-blue-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(image)}
                    className="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full p-1 text-xs"
                    title="Set as featured"
                  >
                    {featuredImage === image ? '★' : '☆'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image)}
                    className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    title="Remove image"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="imageUpload" className="block text-gray-700 text-sm font-bold mb-2 mt-4">Add New Images</label>
            <input id="imageUpload" type="file" multiple onChange={handleFileChange} className="w-full" />
            
            {/* New Images Previews */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {newFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    className={`w-full h-24 object-cover rounded-md ${featuredImage === file.name ? 'ring-2 ring-blue-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(file.name)}
                    className="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full p-1 text-xs"
                    title="Set as featured"
                  >
                    {featuredImage === file.name ? '★' : '☆'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNewFile(file.name)}
                    className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    title="Remove image"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
          {isEdit ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;