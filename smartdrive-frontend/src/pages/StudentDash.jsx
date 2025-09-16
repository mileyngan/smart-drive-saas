// src/pages/StudentDash.jsx
import React, { useState, useEffect } from 'react'; // 👈 Added useEffect
import StudentDashboardNavbar from '../components/StudentDashNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaUserCircle, FaTrophy, FaMedal, FaAward, FaChevronDown, FaChevronUp, FaCheckCircle, FaClock, FaBook, FaGraduationCap } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const StudentDash = () => {
    const [leaderboardPeriod, setLeaderboardPeriod] = useState('daily');
    const [showAllStudents, setShowAllStudents] = useState(false);
    const { theme } = useTheme();
    
    // 👇 ADD THIS: State for user's real name
    const [fullName, setFullName] = useState('Student');

    // 👇 ADD THIS: Load name from localStorage on component mount
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        if (profile && profile.full_name) {
            setFullName(profile.full_name);
        }
        // If not in localStorage, you could fetch it fresh here (optional)
    }, []);

    const upcomingLessons = [
        { id: 1, title: 'Basic Car Controls', date: '2024-03-15', time: '10:00 AM' },
        { id: 2, title: 'Parking Techniques', date: '2024-03-17', time: '2:00 PM' },
    ];

    const progressStats = [
        { label: 'Theory Progress', value: 75 },
        { label: 'Practical Progress', value: 60 },
        { label: 'Overall Progress', value: 68 },
    ];

    // ... rest of your code (courses, leaderboardData, etc.) unchanged ...

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <StudentDashboardNavbar />
            <Breadcrumbs />
            
            {/* 👇 REPLACE "Welcome back, Student!" with dynamic name */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-8`}>
                    Welcome back, {fullName}! {/* ← CHANGED THIS LINE */}
                </h1>

                {/* ... rest of your JSX unchanged ... */}
                
            </div>

            <RegisteredFooter />
        </div>
    );
};

export default StudentDash;