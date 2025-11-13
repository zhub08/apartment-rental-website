import axios from 'axios';
import eventEmitter from './eventEmitter';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use(config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
    response => response,
    error => {
        eventEmitter.dispatch('api-error', error);
        return Promise.reject(error);
    }
);

export const getListings = (params) => API.get('/listings', { params });
export const getFeaturedListings = () => API.get('/listings/featured');
export const getListingById = (id) => API.get(`/listings/${id}`);
export const getFilterOptions = () => API.get('/listings/filters');

// Admin specific API calls (will be expanded later)
export const adminLogin = (credentials) => API.post('/admin/login', credentials);
export const getAdminListings = (params) => API.get('/admin/listings', { params });
export const createAdminListing = (newListing) => API.post('/admin/listings', newListing);
export const updateAdminListing = (id, updatedListing) => API.patch(`/admin/listings/${id}`, updatedListing);
export const deleteAdminListing = (id) => API.delete(`/admin/listings/${id}`);

export default API;
