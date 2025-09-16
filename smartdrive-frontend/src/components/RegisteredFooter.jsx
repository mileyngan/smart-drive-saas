import React from 'react';
import { Link } from 'react-router-dom';

const RegisteredFooter = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    {/* Contact Information */}
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold mb-4 text-green-400">
                            Contact Us
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
                                <a href="mailto:contact@smartdrive.com" className="hover:text-green-400 transition-colors duration-300">
                                    contact@smartdrive.com
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
                                <a href="tel:+1123456789" className="hover:text-green-400 transition-colors duration-300">
                                    +1 (123) 456-789
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

export default RegisteredFooter;
