import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Breadcrumbs from './Breadcrumbs';
import RegisteredFooter from './RegisteredFooter';
import StudentDashNavbar from './StudentDashNavbar';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Sample data for notifications
        const sampleNotifications = [
            {
                id: 1,
                user_id: 'sample-user-id-1',
                title: 'Payment Receipt',
                body: 'Your payment of $50 has been received.',
                document_url: 'https://example.com/receipt1.pdf',
                document_name: 'Receipt_12345.pdf',
                type: 'receipt',
                created_at: new Date().toISOString(),
            },
            {
                id: 2,
                user_id: 'sample-user-id-2',
                title: 'Monthly Report',
                body: 'Your monthly report is ready for download.',
                document_url: 'https://example.com/report1.pdf',
                document_name: 'Monthly_Report_April.pdf',
                type: 'report',
                created_at: new Date().toISOString(),
            },
            {
                id: 3,
                user_id: 'sample-user-id-3',
                title: 'New Feature Update',
                body: 'Check out the new features added to your dashboard.',
                document_url: null,
                document_name: null,
                type: 'update',
                created_at: new Date().toISOString(),
            },
        ];

        // Set sample notifications
        setNotifications(sampleNotifications);

        // Uncomment the following code to fetch from Supabase later
        /*
        const fetchNotifications = async () => {
            const user = supabase.auth.user();
            if (user) {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error fetching notifications:', error);
                } else {
                    setNotifications(data);
                }
            }
        };

        fetchNotifications();
        */
    }, []);

    const dismissNotification = async (id) => {
        // Logic to dismiss notification (to be implemented later)
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <StudentDashNavbar />
            <div className="flex-grow container mx-auto p-4">
                <Breadcrumbs dynamicNames={{ notifications: 'Notifications' }} />
                <h1 className="text-2xl font-bold my-4">Notifications</h1>
                <div className="space-y-4">
                    {notifications.map(notification => (
                        <div key={notification.id} className="border rounded shadow p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{notification.title}</p>
                                <p>{notification.body}</p>
                                {notification.document_url && (
                                    <a href={notification.document_url} className="text-blue-500 underline" download>
                                        Download {notification.document_name}
                                    </a>
                                )}
                            </div>
                            <button onClick={() => dismissNotification(notification.id)} className="text-gray-500 hover:text-red-500">
                                dismiss
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <RegisteredFooter />
        </div>
    );
};

export default Notifications;
