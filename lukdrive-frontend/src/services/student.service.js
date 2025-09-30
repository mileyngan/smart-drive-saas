import api from './api';

const getDashboard = (token) => {
  return api.get('/student/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getEnrolledProgram = (token) => {
  return api.get('/student/program', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getChapters = (token) => {
  return api.get('/student/chapters', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateProgress = (progressData, token) => {
  return api.post('/student/progress', progressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


const getQuiz = (chapterId, token) => {
  return api.get(`/student/chapter/${chapterId}/quiz`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const submitQuiz = (submissionData, token) => {
    return api.post('/student/quiz/submit', submissionData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const studentService = {
  getDashboard,
  getEnrolledProgram,
  getChapters,
  updateProgress,
  getQuiz,
  submitQuiz,
};

export default studentService;