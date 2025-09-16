// src/pages/InstructorDash.jsx
import React from 'react';
import { FaCalendar, FaUsers, FaClock } from 'react-icons/fa';

const InstructorDash = () => {
    const upcomingLessons = [
        { id: 1, student: 'John Doe', time: '10:00 AM', date: '2024-03-15', type: 'Practical' },
        { id: 2, student: 'Jane Smith', time: '2:00 PM', date: '2024-03-15', type: 'Theory' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Instructor Dashboard</h1>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="flex items-center">
                            <FaCalendar className="text-green-600 text-3xl mr-4" />
                            <div>
                                <p className="text-gray-600">Today's Sessions</p>
                                <p className="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="flex items-center">
                            <FaUsers className="text-green-600 text-3xl mr-4" />
                            <div>
                                <p className="text-gray-600">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">24</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="flex items-center">
                            <FaClock className="text-green-600 text-3xl mr-4" />
                            <div>
                                <p className="text-gray-600">Hours Taught</p>
                                <p className="text-2xl font-bold text-gray-900">156</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Lessons */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
                    <div className="space-y-4">
                        {upcomingLessons.map(lesson => (
                            <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-green-500 transition-colors duration-300">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{lesson.student}</h3>
                                    <p className="text-sm text-gray-600">{lesson.time} - {lesson.type}</p>
                                </div>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                                    Start Session
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDash;