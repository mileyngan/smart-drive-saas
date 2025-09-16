import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudentDashNavbar from '../components/StudentDashNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import { supabase } from '../supabase';
import Breadcrumbs from '../components/Breadcrumbs';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sample data for testing
    const sampleAnnouncements = [
        {
            id: 1,
            title: 'New Course Available: Advanced Driving Techniques',
            content: 'We\'re excited to announce our new course on Advanced Driving Techniques. This course covers defensive driving, night driving, and handling adverse weather conditions. Enroll now to improve your driving skills!',
            author: 'Admin Team',
            priority: 'high',
            created_at: '2023-06-15T10:30:00Z'
        },
        {
            id: 2,
            title: 'Holiday Schedule Update',
            content: 'Please note that our office will be closed on July 4th for Independence Day. All scheduled lessons for that day will be rescheduled. We apologize for any inconvenience.',
            author: 'Admin Team',
            priority: 'medium',
            created_at: '2023-06-10T14:15:00Z'
        },
        {
            id: 3,
            title: 'System Maintenance Notice',
            content: 'Our platform will undergo scheduled maintenance on June 25th from 2:00 AM to 4:00 AM EST. During this time, the system will be unavailable. Please plan your study sessions accordingly.',
            author: 'Admin Team',
            priority: 'low',
            created_at: '2023-06-05T09:45:00Z'
        }
    ];

    useEffect(() => {
        // For now, use sample data
        setAnnouncements(sampleAnnouncements);
        setLoading(false);

        // TODO: Uncomment when Supabase is integrated
        // fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <StudentDashNavbar />
            
            <div className="container mx-auto px-4 py-8">
                {/* Use the Breadcrumbs component */}
                <Breadcrumbs />

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Announcements</h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : announcements.length > 0 ? (
                        <div className="space-y-6">
                            {announcements.map((announcement) => (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className={`w-3 h-3 rounded-full ${getPriorityColor(announcement.priority)}`}></div>
                                                <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4">{announcement.content}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>Posted by {announcement.author}</span>
                                                <span>{formatDate(announcement.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No announcements available at this time.</p>
                        </div>
                    )}
                </div>
            </div>

            <RegisteredFooter />
        </div>
    );
};

export default Announcements; 