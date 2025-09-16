import React, { useState } from 'react';
import StudentDashboardNavbar from '../components/StudentDashNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import { FaDownload, FaBook, FaFileAlt, FaRoad } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';

const Library = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resources = [
        {
            id: 1,
            title: 'Road Rules Handbook',
            description: 'Complete guide to traffic rules and regulations',
            imageUrl: '/path/to/road-rules.jpg', // Replace with actual image path
            icon: <FaRoad className="text-4xl text-green-600" />,
            downloadUrl: '/path/to/road-rules.pdf' // Replace with actual PDF path
        },
        {
            id: 2,
            title: 'Traffic Signs Manual',
            description: 'Comprehensive guide to all traffic signs and signals',
            imageUrl: '/path/to/traffic-signs.jpg',
            icon: <FaBook className="text-4xl text-green-600" />,
            downloadUrl: '/path/to/traffic-signs.pdf'
        },
        {
            id: 3,
            title: 'Safe Driving Guidelines',
            description: 'Essential safety practices for new drivers',
            imageUrl: '/path/to/safety.jpg',
            icon: <FaFileAlt className="text-4xl text-green-600" />,
            downloadUrl: '/path/to/safety-guidelines.pdf'
        },
        // Add more resources as needed
    ];

    const handleDownload = async (downloadUrl, title) => {
        try {
            setLoading(true);
            window.open(downloadUrl, '_blank');
        } catch (err) {
            setError('Failed to download file. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <StudentDashboardNavbar />
            <Breadcrumbs />
            
            <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Library</h1>
                    <div className="h-1 w-20 bg-green-600 ml-4 rounded-full"></div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map((resource) => (
                        <div 
                            key={resource.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-102"
                        >
                            <div className="flex p-6">
                                <div className="flex items-center justify-center w-24 h-24 bg-green-50 rounded-lg">
                                    {resource.icon}
                                </div>
                                <div className="ml-6 flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {resource.description}
                                    </p>
                                    <button
                                        onClick={() => handleDownload(resource.downloadUrl, resource.title)}
                                        disabled={loading}
                                        className={`inline-flex items-center px-4 py-2 ${
                                            loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700'
                                        } text-white rounded-full transition-colors duration-300 transform hover:scale-105`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Downloading...
                                            </span>
                                        ) : (
                                            <>
                                                <FaDownload className="mr-2" />
                                                Download
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <RegisteredFooter />
        </div>
    );
};

export default Library;
