import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import adminService from '../../services/admin.service';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import UserForm from '../../components/admin/UserForm';
import { PlusCircle } from 'lucide-react';

const TABS = ['Students', 'Instructors', 'Admins'];

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  const role = activeTab.slice(0, -1).toLowerCase();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', role],
    queryFn: () => adminService.getUsersByRole(role).then(res => res.data),
  });

  const mutationOptions = (successMessage) => ({
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries(['users', role]);
      setIsUserModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred.');
    },
  });

  const createUserMutation = useMutation({
    mutationFn: adminService.createUser,
    ...mutationOptions('User created successfully!'),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => adminService.updateUser(userId, userData),
    ...mutationOptions('User updated successfully!'),
  });

  const deactivateUserMutation = useMutation({
    mutationFn: adminService.deactivateUser,
    ...mutationOptions('User deactivated successfully!'),
  });

  const handleFormSubmit = (data) => {
    if (selectedUser) {
      updateUserMutation.mutate({ userId: selectedUser.id, userData: data });
    } else {
      createUserMutation.mutate(data);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeactivate = (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      deactivateUserMutation.mutate(userId);
    }
  };

  const columns = useMemo(() => {
    return [
      { Header: 'Name', accessor: 'first_name', Cell: ({ row: { original } }) => `${original.first_name} ${original.last_name}` },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Status', accessor: 'is_active', Cell: ({ row: { original } }) => ( <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ original.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}> {original.is_active ? 'Active' : 'Inactive'} </span> ) },
      { Header: 'Date Added', accessor: 'created_at', Cell: ({ row: { original } }) => new Date(original.created_at).toLocaleDateString() },
      { Header: 'Actions', accessor: 'actions', Cell: ({ row: { original } }) => ( <div className="space-x-2"> <Button onClick={() => openEditModal(original)} variant="secondary" className="text-xs py-1 px-2">Edit</Button> <Button onClick={() => handleDeactivate(original.id)} variant="danger" className="text-xs py-1 px-2">Deactivate</Button> </div> ) },
    ];
  }, []);

  const isMutating = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create User
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {TABS.map((tab) => ( <button key={tab} onClick={() => setActiveTab(tab)} className={`${ activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}> {tab} </button> ))}
        </nav>
      </div>

      <div className="mt-4">
        {isLoading && <p>Loading users...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {users && <Table columns={columns} data={users} />}
      </div>

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title={selectedUser ? 'Edit User' : 'Create New User'}>
        <UserForm onSubmit={handleFormSubmit} isLoading={isMutating} defaultValues={selectedUser} isEdit={!!selectedUser} role={role} />
      </Modal>
    </div>
  );
};

export default ManageUsers;