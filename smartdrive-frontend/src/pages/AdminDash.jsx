import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck, FaBullhorn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDash = () => {
    const stats = [
        { icon: <FaUserGraduate />, label: 'Total Students', value: '156' },
        { icon: <FaChalkboardTeacher />, label: 'Instructors', value: '12' },
        { icon: <FaCalendarCheck />, label: 'Active Courses', value: '8' },
        { icon: <FaBullhorn />, label: 'Announcements', value: '3' },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <AdminNavbar />
            <div className="flex-grow container mx-auto p-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="text-green-600 text-3xl mr-4">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                                Create New Announcement
                            </button>
                            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                                Manage Instructors
                            </button>
                            <Link to="/smartdrive-frontend/admin/course-management" className="block">
                                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                                    Manage Courses
                                </button>
                            </Link>
                            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                                View Reports
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {/* Add recent activity items here */}
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-gray-600">New student registration</p>
                                <p className="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-gray-600">Course completion - John Doe</p>
                                <p className="text-xs text-gray-500">1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <RegisteredFooter />
        </div>
    );
};

export default AdminDash;