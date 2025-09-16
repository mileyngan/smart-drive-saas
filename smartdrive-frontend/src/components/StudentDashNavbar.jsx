import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 Added useNavigate
import { FaHome, FaBook, FaQuestionCircle, FaBell, FaUser, FaSignOutAlt, FaUserCircle, FaSun, FaMoon, FaBars, FaTimes, FaRoad } from 'react-icons/fa';
import { IoLibrary } from 'react-icons/io5';
// ❌ Removed: import { supabase } from '../supabase';
import { useTheme } from '../context/ThemeContext';

const StudentDashboardNavbar = () => {
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate(); // 👈 Added

    // 👇 REPLACED: Get name from localStorage.profile
    const [userName, setUserName] = useState('Student');

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        if (profile && profile.full_name) {
            setUserName(profile.full_name);
        }
    }, []);

    const courses = [
        { id: 1, name: 'Road Rules Basics' },
        { id: 2, name: 'Traffic Signs' },
        { id: 3, name: 'Safe Driving Practices' },
    ];

    // 👇 FIXED: Logout without Supabase client
    const handleLogout = () => {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
        
        // Redirect to login
        navigate('/smartdrive-frontend/login');
    };

    const profileDropdownRef = useRef(null);
    const courseDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target)) {
                setShowCourseDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`${theme === 'dark' ? 'bg-gray-800 shadow-md' : 'bg-white shadow-md'}`}>
            {/* Top Row */}
            <div className="px-6 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo Section */}
                    <Link to="/smartdrive-frontend/" className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors duration-300`}>
                        SmartDrive
                    </Link>

                    {/* Right Side Items */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors duration-300`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
                        </button>

                        {/* Profile Section */}
                        <div ref={profileDropdownRef} className="relative">
                            <button 
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center space-x-3 focus:outline-none"
                            >
                                <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} flex items-center justify-center`}>
                                    <FaUserCircle className={`text-2xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                                </div>
                                <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hidden md:inline`}>{userName}</span>
                            </button>

                            {showProfileDropdown && (
                                <div className={`absolute right-0 mt-2 w-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5`}>
                                    <Link
                                        to="/smartdrive-frontend/student/profile"
                                        className={`flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-green-50'} transition-colors duration-300`}
                                    >
                                        <FaUser className="mr-2" />
                                        Profile
                                    </Link>
                                    <Link
                                        to="/smartdrive-frontend/student/notifications"
                                        className={`flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-green-50'} transition-colors duration-300`}
                                    >
                                        <FaBell className="mr-2" />
                                        Notifications
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-green-50'} transition-colors duration-300`}
                                    >
                                        <FaSignOutAlt className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Desktop Navigation */}
            <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-900'} px-6 hidden lg:block`}>
                <div className="max-w-7xl mx-auto flex justify-center items-center space-x-8">
                    <Link to="/smartdrive-frontend/student" className="flex items-center py-3 px-1 text-white bg-gray-900 hover:bg-green-600 transition-all duration-300 ease-in-out">
                        <FaHome className="text-xl" />
                        <span className="ml-3">Home</span>
                    </Link>

                    <Link to="/smartdrive-frontend/student/library" className="flex items-center py-3 px-1 text-white bg-gray-900 hover:bg-green-600 transition-all duration-300 ease-in-out">
                        <IoLibrary className="text-xl" />
                        <span className="ml-3">Library</span>
                    </Link>

                    <div className="relative">
                        <button 
                            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                            className="flex items-center py-3 px-1 text-white bg-gray-900 hover:bg-green-600 transition-all duration-300 ease-in-out"
                        >
                            <FaBook className="text-xl" />
                            <span className="ml-3">My Courses</span>
                        </button>
                        {showCourseDropdown && (
                            <div ref={courseDropdownRef} className={`absolute left-0 mt-2 w-48 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-800'} rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5`}>
                                {courses.map(course => (
                                    <Link
                                        key={course.id}
                                        to={`/smartdrive-frontend/student/course/${course.id}`}
                                        className="block px-4 py-2 text-sm text-white hover:bg-green-600 transition-all duration-300 ease-in-out"
                                    >
                                        {course.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/smartdrive-frontend/student/support" className="flex items-center py-3 px-1 text-white bg-gray-900 hover:bg-green-600 transition-all duration-300 ease-in-out">
                        <FaQuestionCircle className="text-xl" />
                        <span className="ml-3">Support</span>
                    </Link>

                    <Link to="/smartdrive-frontend/student/announcements" className="flex items-center py-3 px-1 text-white bg-gray-900 hover:bg-green-600 transition-all duration-300 ease-in-out">
                        <FaBell className="text-xl" />
                        <span className="ml-3">Announcements</span>
                    </Link>

                    <Link to="/smartdrive-frontend/student/journey" className="flex items-center py-3 px-1 text-white bg-gray-900 hover:bg-green-600 transition-all duration-300 ease-in-out">
                        <FaRoad className="text-xl" />
                        <span className="ml-3">My Journey</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-900'} px-6 lg:hidden`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
                    <button 
                        onClick={toggleMobileMenu}
                        className="text-white focus:outline-none"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                    <div className="w-6"></div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div 
                    ref={mobileMenuRef}
                    className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-800'} lg:hidden`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link 
                            to="/smartdrive-frontend/student" 
                            className="flex items-center px-3 py-2 text-white hover:bg-green-600 rounded-md transition-all duration-300 ease-in-out"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <FaHome className="text-xl mr-3" />
                            <span>Home</span>
                        </Link>

                        <Link 
                            to="/smartdrive-frontend/student/library" 
                            className="flex items-center px-3 py-2 text-white hover:bg-green-600 rounded-md transition-all duration-300 ease-in-out"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <IoLibrary className="text-xl mr-3" />
                            <span>Library</span>
                        </Link>

                        <div className="relative">
                            <button 
                                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                                className="flex items-center w-full px-3 py-2 text-white hover:bg-green-600 rounded-md transition-all duration-300 ease-in-out"
                            >
                                <FaBook className="text-xl mr-3" />
                                <span>My Courses</span>
                            </button>
                            {showCourseDropdown && (
                                <div className="pl-6 space-y-1">
                                    {courses.map(course => (
                                        <Link
                                            key={course.id}
                                            to={`/smartdrive-frontend/student/course/${course.id}`}
                                            className="flex items-center px-3 py-2 text-white hover:bg-green-600 rounded-md transition-all duration-300 ease-in-out"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                setShowCourseDropdown(false);
                                            }}
                                        >
                                            <span>{course.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link 
                            to="/smartdrive-frontend/student/support" 
                            className="flex items-center px-3 py-2 text-white hover:bg-green-600 rounded-md transition-all duration-300 ease-in-out"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <FaQuestionCircle className="text-xl mr-3" />
                            <span>Support</span>
                        </Link>

                        <Link 
                            to="/smartdrive-frontend/student/announcements" 
                            className="flex items-center px-3 py-2 text-white hover:bg-green-600 rounded-md transition-all duration-300 ease-in-out"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <FaBell className="text-xl mr-3" />
                            <span>Announcements</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default StudentDashboardNavbar;