// frontend/src/pages/CourseManagementDash.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisteredFooter from '../components/RegisteredFooter';

const CourseManagementDash = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programType, setProgramType] = useState('novice'); // or 'recyclage'

  useEffect(() => {
    fetchChapters();
  }, [programType]);

  const fetchChapters = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/chapter/program/${programType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setChapters(data);
    } catch (err) {
      console.error('Error fetching chapters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgramChange = (e) => {
    setProgramType(e.target.value);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading chapters...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Chapters ({programType === 'novice' ? 'Novice' : 'Recyclage'})</h1>
          <Link to="/smartdrive-frontend/admin" className="text-green-600 hover:text-green-700">
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Program</label>
          <select
            value={programType}
            onChange={handleProgramChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="novice">Novice Program</option>
            <option value="recyclage">Recyclage Program</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Link to={`/smartdrive-frontend/admin/chapter/create?program=${programType}`} className="block">
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                    Create New Chapter
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Chapter List Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chapters</h2>
            <div className="space-y-4">
              {chapters.map(chapter => (
                <div 
                  key={chapter.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-102"
                >
                  <div className="flex p-4">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src="https://via.placeholder.com/300" 
                        alt={chapter.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Chapter {chapter.chapter_order}: {chapter.title}
                        </h3>
                        <div className="flex space-x-2">
                          <Link to={`/smartdrive-frontend/admin/chapter/edit/${chapter.id}`} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
                            Edit
                          </Link>
                          <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300">
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {chapter.ebook_content 
                          ? new DOMParser().parseFromString(chapter.ebook_content, 'text/html').body.textContent.substring(0, 100) + '...'
                          : 'No content yet'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RegisteredFooter />
    </div>
  );
};

export default CourseManagementDash;