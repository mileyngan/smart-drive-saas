import api from './api';

const getPendingSchools = (token) => {
  return api.get('/superadmin/schools/pending', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const approveSchool = (schoolId, token) => {
  return api.put(`/superadmin/schools/${schoolId}/approve`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const rejectSchool = (schoolId, token) => {
  return api.put(`/superadmin/schools/${schoolId}/reject`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const superadminService = {
  getPendingSchools,
  approveSchool,
  rejectSchool,
};

export default superadminService;