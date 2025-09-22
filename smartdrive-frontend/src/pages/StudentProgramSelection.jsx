// smartdrive-frontend/src/pages/StudentProgramSelection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StudentProgramSelection = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Choose Your Program
        </h1>
        
        <div className="space-y-4">
          <Link to="/smartdrive-frontend/student/chapters/novice" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-300">
              <h2 className="text-lg font-semibold text-gray-800">Novice Program</h2>
              <p className="text-sm text-gray-600 mt-1">
                For new drivers. Learn from scratch.
              </p>
            </div>
          </Link>

          <Link to="/smartdrive-frontend/student/chapters/recyclage" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-300">
              <h2 className="text-lg font-semibold text-gray-800">Recyclage Program</h2>
              <p className="text-sm text-gray-600 mt-1">
                For experienced drivers. Quick refresher.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentProgramSelection;