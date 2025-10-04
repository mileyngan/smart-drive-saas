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

const enrollStudent = (enrollmentData) => {
  return api.post('/admin/enroll', enrollmentData);
};

const logPayment = (paymentData) => {
  return api.post('/admin/payments', paymentData);
};

const getStudentDetails = (studentId) => {
  return api.get(`/admin/student/${studentId}`);
};

const updateSubscription = (plan) => {
  return api.put('/admin/subscription', { plan });
};

const adminService = {
  getDashboardStats,
  getUsersByRole,
  createUser,
  updateUser,
  deactivateUser,
  getPrograms,
  enrollStudent,
  logPayment,
  getStudentDetails,
  updateSubscription,
};

export default adminService;