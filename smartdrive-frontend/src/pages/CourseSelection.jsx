import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const courses = [
    {
        id: 1,
        title: 'Traffic Signals and Road Rules',
        price: '$79',
        image: '/path/to/traffic-signals.jpg',
        mandatory: true, // This course is mandatory
    },
    {
        id: 2,
        title: 'Road Rules Basics',
        price: '$99',
        image: '/path/to/road-rules.jpg',
    },
    {
        id: 3,
        title: 'Safe Driving Techniques',
        price: '$149',
        image: '/path/to/safe-driving.jpg',
    },
    {
        id: 4,
        title: 'Advanced Intersection Management',
        price: '$129',
        image: '/path/to/intersection-management.jpg',
    },
    // Add more courses as needed
];

const CourseSelection = () => {
    const [selectedCourses, setSelectedCourses] = useState([1]); // Start with the mandatory course selected

    const handleSelectCourse = (courseId) => {
        if (courseId === 1) return; // Prevent unselecting the mandatory course
        setSelectedCourses((prev) => {
            if (prev.includes(courseId)) {
                return prev.filter((id) => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    };

    const totalPrice = selectedCourses.reduce((total, courseId) => {
        const course = courses.find(course => course.id === courseId);
        return total + (course ? parseFloat(course.price.replace('$', '')) : 0);
    }, 0);

    const isCheckoutDisabled = selectedCourses.length < 2; // Require at least one additional course

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Select Your Courses</h1>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <motion.div
                        key={course.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                        <div
                            className="h-48 bg-cover bg-center"
                            style={{ backgroundImage: `url(${course.image})` }}
                        >
                            <div className="flex items-end h-full bg-black bg-opacity-30 p-4">
                                <h2 className="text-white text-xl font-semibold">{course.title}</h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-lg font-bold">{course.price}</p>
                            <label className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={selectedCourses.includes(course.id) || course.mandatory}
                                    onChange={() => handleSelectCourse(course.id)}
                                    className="form-checkbox h-5 w-5 text-green-600"
                                    disabled={course.mandatory} // Disable checkbox for mandatory course
                                />
                                <span className="ml-2 text-gray-700">Select</span>
                            </label>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Review Card */}
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Selected Courses</h2>
                <ul className="space-y-2">
                    {selectedCourses.map(courseId => {
                        const course = courses.find(course => course.id === courseId);
                        return (
                            <li key={courseId} className="flex justify-between">
                                <span>{course.title}</span>
                                <span>{course.price}</span>
                            </li>
                        );
                    })}
                </ul>
                <div className="flex justify-between mt-4 font-bold">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                </div>
                <Link
                    to="/smartdrive-frontend/checkout" 
                    className={`mt-4 inline-block w-full px-6 py-3 bg-green-600 text-white rounded-full text-center transition-all duration-300 ${isCheckoutDisabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-green-700'}`}
                    disabled={isCheckoutDisabled}
                >
                    Checkout
                </Link>
            </div>
        </div>
    );
};

export default CourseSelection;
