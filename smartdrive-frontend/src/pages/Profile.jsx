import React, { useEffect, useState } from 'react';
// ❌ Removed: import { supabase } from '../supabase';
import Breadcrumbs from '../components/Breadcrumbs';
import RegisteredFooter from '../components/RegisteredFooter';
import StudentDashNavbar from '../components/StudentDashNavbar';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [full_name, setFull_name] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const profileData = await response.json();
                
                // Set form fields
                setFull_name(profileData.full_name || '');
                setPhone(profileData.phone || '');
                setEmail(profileData.email || '');
                
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Fallback to localStorage
                const savedProfile = JSON.parse(localStorage.getItem('profile'));
                if (savedProfile) {
                    setFull_name(savedProfile.full_name || '');
                    setPhone(savedProfile.phone || '');
                    setEmail(savedProfile.email || '');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in again');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    full_name,
                    phone
                    // Add other fields as needed
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedProfile = await response.json();
            
            // Update localStorage
            const currentProfile = JSON.parse(localStorage.getItem('profile')) || {};
            const newProfile = { ...currentProfile, full_name, phone };
            localStorage.setItem('profile', JSON.stringify(newProfile));
            
            alert('Profile updated successfully!');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) return (
        <div className="flex flex-col min-h-screen">
            <StudentDashNavbar />
            <div className="flex-grow container mx-auto p-4">
                <Breadcrumbs dynamicNames={{ profile: 'Profile' }} />
                <div>Loading...</div>
            </div>
            <RegisteredFooter />
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <StudentDashNavbar />
            <div className="flex-grow container mx-auto p-4">
                <Breadcrumbs dynamicNames={{ profile: 'Profile' }} />
                <h1 className="text-2xl font-bold my-4">Profile</h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={full_name}
                            onChange={(e) => setFull_name(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
                        Update Profile
                    </button>
                </form>
            </div>
            <RegisteredFooter />
        </div>
    );
};

export default Profile;