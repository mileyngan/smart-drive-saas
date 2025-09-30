import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import superadminService from '../../services/superadmin.service';
import Button from '../../components/common/Button';

const SuperAdminDashboard = () => {
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);

  const { data: schools, isLoading, error } = useQuery({
    queryKey: ['pendingSchools'],
    queryFn: superadminService.getPendingSchools,
  });

  const approveMutation = useMutation({
    mutationFn: superadminService.approveSchool,
    onSuccess: () => {
      toast.success('School approved successfully!');
      queryClient.invalidateQueries(['pendingSchools']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to approve school.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ schoolId, reason }) => superadminService.rejectSchool(schoolId, reason),
    onSuccess: () => {
      toast.success('School rejected successfully!');
      queryClient.invalidateQueries(['pendingSchools']);
      setSelectedSchool(null);
      setRejectionReason('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to reject school.');
    },
  });

  const handleApprove = (schoolId) => {
    approveMutation.mutate(schoolId);
  };

  const handleRejectClick = (school) => {
    setSelectedSchool(school);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason) {
        toast.error('Rejection reason cannot be empty.');
        return;
    }
    rejectMutation.mutate({ schoolId: selectedSchool.id, reason: rejectionReason });
  }

  if (isLoading) return <div>Loading pending schools...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Pending School Registrations</h2>

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">School Name</th>
              <th className="py-3 px-6 text-left">Ministry Code</th>
              <th className="py-3 px-6 text-center">Contact</th>
              <th className="py-3 px-6 text-center">Address</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {schools?.data && schools.data.length > 0 ? (
              schools.data.map((school) => (
                <tr key={school.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{school.name}</td>
                  <td className="py-3 px-6 text-left">{school.ministry_code}</td>
                  <td className="py-3 px-6 text-center">{school.contact_info}</td>
                  <td className="py-3 px-6 text-center">{school.address}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <Button
                        variant="success"
                        onClick={() => handleApprove(school.id)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleRejectClick(school)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center">No pending schools found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedSchool && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-xl">
                <h3 className="text-lg font-bold mb-4">Reject School: {selectedSchool.name}</h3>
                <textarea
                    className="w-full p-2 border rounded"
                    rows="4"
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" onClick={() => setSelectedSchool(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleRejectSubmit} disabled={rejectMutation.isPending}>
                        {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;