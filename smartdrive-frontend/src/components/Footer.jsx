import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Contact Information */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              GET IN TOUCH
            </h3>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center transition-colors duration-300 hover:text-green-400">
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:fakemail@smartdrive.com" className="hover:text-green-400 transition-colors duration-300">
                  fakemail@smartdrive.com
                </a>
              </p>
              <p className="flex items-center transition-colors duration-300 hover:text-green-400">
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:+1123456423" className="hover:text-green-400 transition-colors duration-300">
                  +1123456423
                </a>
              </p>
            </div>
            </div>

          {/* Logo */}
          <Link 
            to="/smartdrive-frontend/" 
            className="group transform transition-all duration-300 hover:scale-105"
          >
            <h1 className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
              SmartDrive
            </h1>
          </Link>
          
          {/* Description */}
            <div className="mt-8 max-w-md">
            <p className="text-gray-400 leading-6">
                SmartDrive empowers you to become a confident, skilled, and safe driver through expert-led lessons and hands-on practice. This is fake.
            </p>
            </div>
        </div>

        {/* Site Links */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-green-400">SITE</h3>
          <ul className="flex flex-wrap gap-4 text-gray-400">
            <li>
              <Link to="/smartdrive-frontend/" className="hover:text-green-400 transition-colors duration-300">Home</Link>
            </li>
            <li>
              <Link to="/smartdrive-frontend/about" className="hover:text-green-400 transition-colors duration-300">About Us</Link>
            </li>
            <li>
              <Link to="/smartdrive-frontend/contact" className="hover:text-green-400 transition-colors duration-300">Contact Us</Link>
            </li>
            <li>
              <Link to="/smartdrive-frontend/services" className="hover:text-green-400 transition-colors duration-300">Services</Link>
            </li>
          </ul>
        </div>


        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-400">
            Copyright © 2025 SmartDrive - All Rights Reserved.
          </p>
        </div>
    </div>
    </footer>
  );
};

export default Footer;