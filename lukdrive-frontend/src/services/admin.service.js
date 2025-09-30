import api from './api';

const getDashboardStats = (token) => {
  return api.get('/admin/dashboard/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getUsersByRole = (role, token) => {
  return api.get(`/admin/users/${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createUser = (userData, token) => {
  return api.post('/admin/users', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateUser = (userId, userData, token) => {
  return api.put(`/admin/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deactivateUser = (userId, token) => {
  return api.delete(`/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const enrollStudent = (enrollmentData, token) => {
  return api.post('/admin/enrollments', enrollmentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getPrograms = (token) => {
    return api.get('/admin/programs', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const adminService = {
  getDashboardStats,
  getUsersByRole,
  createUser,
  updateUser,
  deactivateUser,
  enrollStudent,
  getPrograms,
};

export default adminService;