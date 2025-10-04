import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import { ArrowLeft } from 'lucide-react';
import StudentSummary from '../../components/admin/StudentSummary';
import EnrollmentDetails from '../../components/admin/EnrollmentDetails';
import LogPaymentForm from '../../components/admin/LogPaymentForm';

const StudentDetailPage = () => {
    const { studentId } = useParams();

    const { data: student, isLoading, error } = useQuery({
        queryKey: ['studentDetails', studentId],
        queryFn: () => adminService.getStudentDetails(studentId).then(res => res.data),
        enabled: !!studentId,
    });

    if (isLoading) {
        return <div>Loading student details...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error fetching student details: {error.message}</div>;
    }

    if (!student) {
        return <div>Student not found.</div>;
    }

    const enrollment = student.enrollments ? student.enrollments[0] : null;

    return (
        <div>
            <Link to="/admin/users" className="flex items-center text-blue-600 hover:underline mb-4">
                <ArrowLeft size={18} className="mr-1" />
                Back to User Management
            </Link>

            <h1 className="text-3xl font-bold text-gray-800">
                {student.first_name} {student.last_name}'s File
            </h1>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <EnrollmentDetails enrollment={enrollment} />
                </div>
                <div className="space-y-6">
                    <StudentSummary student={student} />
                    {enrollment && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Log a New Payment</h2>
                            <LogPaymentForm studentId={student.id} enrollmentId={enrollment.id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;