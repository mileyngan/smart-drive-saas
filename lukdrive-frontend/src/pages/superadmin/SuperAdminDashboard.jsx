import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import superadminService from '../../services/superadmin.service';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    const { data: pendingSchools, isLoading, error } = useQuery({
        queryKey: ['pendingSchools'],
        queryFn: () => superadminService.getPendingSchools(token).then(res => res.data),
        enabled: !!token,
    });

    const mutationOptions = {
        onSuccess: (response) => {
            toast.success(response.data.message);
            queryClient.invalidateQueries(['pendingSchools']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Action failed.');
        }
    };

    const approveMutation = useMutation({
        mutationFn: (schoolId) => superadminService.approveSchool(schoolId, token),
        ...mutationOptions,
    });

    const rejectMutation = useMutation({
        mutationFn: (schoolId) => superadminService.rejectSchool(schoolId, token),
        ...mutationOptions,
    });

    if (isLoading) return <div>Loading pending schools...</div>;
    if (error) return <div className="text-red-500">Error fetching data: {error.message}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">Review and approve new driving school registrations.</p>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {pendingSchools?.length === 0 && (
                        <li className="p-6 text-center text-gray-500">No schools are currently pending approval.</li>
                    )}
                    {pendingSchools?.map((school) => (
                        <li key={school.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 truncate">{school.name}</p>
                                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                                        <Button
                                            variant="primary"
                                            className="text-xs"
                                            onClick={() => approveMutation.mutate(school.id)}
                                            disabled={approveMutation.isPending || rejectMutation.isPending}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="text-xs"
                                            onClick={() => rejectMutation.mutate(school.id)}
                                            disabled={approveMutation.isPending || rejectMutation.isPending}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Ministry Code: {school.ministry_code}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>Applied on: {new Date(school.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;