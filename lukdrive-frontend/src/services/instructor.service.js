import api from './api';

const getStudents = (token) => {
  return api.get('/instructor/students', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getStudentFile = (studentId, token) => {
  return api.get(`/instructor/students/${studentId}/file`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateStudentProgress = (studentId, progressData, token) => {
  return api.put(`/instructor/students/${studentId}/progress`, progressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const instructorService = {
  getStudents,
  getStudentFile,
  updateStudentProgress,
};

export default instructorService;