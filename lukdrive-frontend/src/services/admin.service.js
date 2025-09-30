import api from './api';

const getDashboardStats = () => {
  return api.get('/admin/dashboard/stats');
};

const getUsersByRole = (role) => {
  return api.get(`/admin/users/${role}`);
};

const createUser = (userData) => {
  return api.post('/admin/users', userData);
};

const updateUser = (userId, userData) => {
  return api.put(`/admin/users/${userId}`, userData);
};

const deactivateUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

const getPrograms = () => {
    return api.get('/admin/programs');
};

const adminService = {
  getDashboardStats,
  getUsersByRole,
  createUser,
  updateUser,
  deactivateUser,
  getPrograms,
};

export default adminService;