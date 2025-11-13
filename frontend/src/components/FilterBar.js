import React, { useState, useEffect, useCallback } from 'react';
import { getFilterOptions } from '../services/api';

const FilterBar = ({ onApplyFilters }) => {
  const [filterOptions, setFilterOptions] = useState({
    listingTypes: [],
    propertyTypes: [],
    price: { minPrice: 0, maxPrice: 0 },
    bedrooms: { minBedrooms: 0, maxBedrooms: 0 },
    bathrooms: { minBathrooms: 0, maxBathrooms: 0 },
  });

  const initialFiltersState = {
    listingType: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    currency: 'USD', // Default to USD
  };

  const [filters, setFilters] = useState(initialFiltersState);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFilters(initialFiltersState);
    onApplyFilters(initialFiltersState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-semibold mb-4 text-center">Filter Listings</h3>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">Listing Type</label>
            <select
              id="listingType"
              name="listingType"
              value={filters.listingType}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              {filterOptions.listingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
            <select
              id="propertyType"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              {filterOptions.propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder={`Min ${filterOptions.bedrooms.minBedrooms || 0}`}
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder={`Min ${filterOptions.bathrooms.minBathrooms || 0}`}
            />
          </div>

          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder={`Min ${filterOptions.price.minPrice || 0}`}
            />
          </div>

          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder={`Max ${filterOptions.price.maxPrice || 0}`}
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="currency"
              name="currency"
              value={filters.currency}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="USD">USD</option>
              <option value="ETB">ETB</option>
            </select>
          </div>

          <div className="lg:col-span-5 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="w-full px-6 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="w-full px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterBar;
