import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ContactModal from './ContactModal'; // Import ContactModal

const Layout = ({ children }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onContactClick={handleContactClick} />
      <main className="flex-grow py-8 pt-24">
        {children}
      </main>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={handleCloseContactModal} />
    </div>
  );
};

export default Layout;