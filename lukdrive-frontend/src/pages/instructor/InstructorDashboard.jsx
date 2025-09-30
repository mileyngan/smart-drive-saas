import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import instructorService from '../../services/instructor.service';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const InstructorDashboard = () => {
    const token = useAuthStore((state) => state.token);

    const { data: students, isLoading, error } = useQuery({
        queryKey: ['instructorStudents'],
        queryFn: () => instructorService.getStudents(token).then(res => res.data),
        enabled: !!token,
    });

    if (isLoading) return <div>Loading students...</div>;
    if (error) return <div className="text-red-500">Error fetching students: {error.message}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">My Students</h1>
            <p className="mt-1 text-gray-600">View and manage the progress of your students.</p>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {students?.map((student) => (
                        <li key={student.id}>
                            <Link to={`/instructor/student/${student.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 flex items-center sm:px-6">
                                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-600 truncate">{student.first_name} {student.last_name}</p>
                                            <p className="mt-1 flex items-center text-sm text-gray-500">{student.email}</p>
                                        </div>
                                        <div className="mt-4 flex-shrink-0 sm:mt-0">
                                            {/* Placeholder for progress */}
                                            <p className="text-sm text-gray-500">Progress: N/A</p>
                                        </div>
                                    </div>
                                    <div className="ml-5 flex-shrink-0">
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InstructorDashboard;