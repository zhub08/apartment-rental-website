import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BNHNextHomeLogo from '../assets/appartemnt logo.png'; // Import the logo

const Navbar = ({ onContactClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="fixed top-0 w-full z-50 bg-white text-gray-800 shadow-md">
      <div className="flex justify-between items-center py-4 px-4 md:px-8">
        <div className="flex flex-col">
          <Link to="/">
            <img src={BNHNextHomeLogo} alt="BNH NextHome Logo" className="h-16 w-auto" />
          </Link>
          <p className="text-xs text-gray-500">Your Trusted Partner in Finding a Home</p>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-800 focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium">Home</Link>
          <a href="#all-listings" className="text-gray-800 hover:text-blue-600 font-medium">Listings</a>
          <button onClick={onContactClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300">
            Contact
          </button>
          {token && isAdminRoute && ( // Only show if token exists AND it's an admin route
            <>
              <Link to="/admin/dashboard" className="text-gray-800 hover:text-blue-600 font-medium">Dashboard</Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 z-20">
          <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium" onClick={toggleMobileMenu}>Home</Link>
          <a href="#all-listings" className="text-gray-800 hover:text-blue-600 font-medium" onClick={toggleMobileMenu}>Listings</a>
          <button onClick={() => { onContactClick(); toggleMobileMenu(); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300">
            Contact
          </button>
          {token && isAdminRoute && ( // Only show if token exists AND it's an admin route
            <>
              <Link to="/admin/dashboard" className="text-gray-800 hover:text-blue-600 font-medium" onClick={toggleMobileMenu}>Dashboard</Link>
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
