import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LukDrive. All rights reserved.</p>
          <p className="mt-1">
            Your trusted partner in driving education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;