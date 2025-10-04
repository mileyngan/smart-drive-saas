import React from 'react';
import { Mail, Phone, User } from 'lucide-react';

const StudentSummary = ({ student }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2" /> Student Information
            </h2>
            <div className="space-y-3 text-sm">
                <div className="flex items-center">
                    <Mail size={16} className="text-gray-500 mr-3" />
                    <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                        {student.email}
                    </a>
                </div>
                <div className="flex items-center">
                    <Phone size={16} className="text-gray-500 mr-3" />
                    <span>{student.phone_number || 'Not provided'}</span>
                </div>
                {/* Add other student details as needed */}
            </div>
        </div>
    );
};

export default StudentSummary;