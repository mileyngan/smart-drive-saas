import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import RegisteredFooter from '../components/RegisteredFooter';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [userType, setUserType] = useState('students'); // State to track the selected user type
    const [notification, setNotification] = useState(''); // State for notification messages

    useEffect(() => {
        // Uncomment the following line to fetch users from the backend
        // fetchUsers();
        // Sample data for demonstration
        const sampleUsers = {
            students: [
                { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
                { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
                { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
            ],
            instructors: [
                { id: 1, name: 'Dr. Sarah Connor', email: 'sarah@example.com' },
                { id: 2, name: 'Mr. John Doe', email: 'john@example.com' },
            ],
            admins: [
                { id: 1, name: 'Admin One', email: 'admin1@example.com' },
                { id: 2, name: 'Admin Two', email: 'admin2@example.com' },
            ],
        };
        setUsers(sampleUsers.students); // Default to students
    }, []);

    // Comment out the fetchUsers function if using sample data
    /*
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users'); // Adjust the endpoint as necessary
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    */

    const handleUserTypeChange = (type) => {
        setUserType(type);
        switch (type) {
            case 'students':
                setUsers([
                    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
                    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
                    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
                ]);
                break;
            case 'instructors':
                setUsers([
                    { id: 1, name: 'Dr. Sarah Connor', email: 'sarah@example.com' },
                    { id: 2, name: 'Mr. John Doe', email: 'john@example.com' },
                ]);
                break;
            case 'admins':
                setUsers([
                    { id: 1, name: 'Admin One', email: 'admin1@example.com' },
                    { id: 2, name: 'Admin Two', email: 'admin2@example.com' },
                ]);
                break;
            default:
                break;
        }
    };

    const handleUpdateUser = async (userId) => {
        // Sample implementation for updating a user
        setUsers(users.map(user => (user.id === userId ? editingUser : user)));
        setEditingUser(null);
        setNotification('User updated successfully!'); // Set notification message
        setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    };

    const handleDeleteUser = async (userId) => {
        // Sample implementation for deleting a user
        setUsers(users.filter(user => user.id !== userId));
        setNotification('User deleted successfully!'); // Set notification message
        setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    };

    return (
        <div className="flex flex-col min-h-screen">
            <AdminNavbar />
            <div className="flex-grow container mx-auto p-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Manage Users</h1>
                
                {/* Notification Message */}
                {notification && (
                    <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
                        {notification}
                    </div>
                )}

                {/* User Type Buttons */}
                <div className="mb-4 flex justify-center space-x-4">
                    <button onClick={() => handleUserTypeChange('students')} className="bg-blue-500 text-white p-2 rounded">
                        Students
                    </button>
                    <button onClick={() => handleUserTypeChange('instructors')} className="bg-blue-500 text-white p-2 rounded">
                        Instructors
                    </button>
                    <button onClick={() => handleUserTypeChange('admins')} className="bg-blue-500 text-white p-2 rounded">
                        Admin
                    </button>
                </div>

                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-100 transition duration-200">
                                <td className="border px-4 py-2">{user.name}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2 flex space-x-2">
                                    <button onClick={() => setEditingUser(user)} className="text-blue-600">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {editingUser && (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Edit User</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            className="border p-2 mr-2"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            className="border p-2 mr-2"
                        />
                        <button onClick={() => handleUpdateUser(editingUser.id)} className="bg-blue-600 text-white p-2 rounded">
                            Update User
                        </button>
                    </div>
                )}
            </div>
            <RegisteredFooter />
        </div>
    );
};

export default AdminUsers;
