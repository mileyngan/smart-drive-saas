// frontend/src/pages/CourseManagementDash.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RegisteredFooter from '../components/RegisteredFooter';

const CourseManagementDash = () => {
    // Sample courses data - replace with actual data from your backend
    const courses = [
        {
            id: 1,
            title: 'Road Rules Basics',
            description: 'Learn the fundamental rules of the road and traffic regulations',
            image: '/path/to/road-rules.jpg',
            enrolledStudents: 45,
            instructor: 'John Doe'
        },
        {
            id: 2,
            title: 'Traffic Signs Mastery',
            description: 'Comprehensive guide to understanding traffic signs and signals',
            image: '/path/to/traffic-signs.jpg',
            enrolledStudents: 32,
            instructor: 'Jane Smith'
        },
        {
            id: 3,
            title: 'Safe Driving Practices',
            description: 'Essential techniques for safe and defensive driving',
            image: '/path/to/safe-driving.jpg',
            enrolledStudents: 28,
            instructor: 'Mike Johnson'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Course Management Dashboard</h1>
                    <Link to="/smartdrive-frontend/admin" className="text-green-600 hover:text-green-700">
                        Back to Admin Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-4">
                                <Link to="/smartdrive-frontend/admin/course-management/create" className="block">
                                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                                        Create New Course
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Course List Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Courses</h2>
                        <div className="space-y-4">
                            {courses.map(course => (
                                <div 
                                    key={course.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-102"
                                >
                                    <div className="flex p-4">
                                        <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                            <img 
                                                src={course.image} 
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {course.title}
                                                </h3>
                                                <div className="flex space-x-2">
                                                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
                                                        Edit
                                                    </button>
                                                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {course.description}
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="mr-4">Instructor: {course.instructor}</span>
                                                <span>Enrolled Students: {course.enrolledStudents}</span>
                                            </div>
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