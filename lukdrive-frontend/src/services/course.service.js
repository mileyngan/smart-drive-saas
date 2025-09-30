import api from './api';

const createCourse = (courseData, token) => {
  return api.post('/courses', courseData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const addChapter = (courseId, chapterData, token) => {
    return api.post(`/courses/${courseId}/chapters`, chapterData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const uploadFile = (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getChaptersByCourse = (courseId, token) => {
    return api.get(`/courses/${courseId}/chapters`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const courseService = {
  createCourse,
  addChapter,
  uploadFile,
  getChaptersByCourse,
};

export default courseService;