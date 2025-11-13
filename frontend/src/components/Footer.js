import React from 'react';

const Footer = () => {
  return (
    <footer className="relative h-48 flex items-center justify-center text-white overflow-hidden mt-10">
      <img
        src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Modern architecture background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-center">
        <p className="text-lg">Apartemnt</p>
        <p className="text-sm text-gray-300">
          Copyright 2025 —{' '}
          <a href="#links" className="hover:underline">links</a> |{' '}
          <a href="#privacy" className="hover:underline">privacy</a> |{' '}
          <a href="#terms" className="hover:underline">terms</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
