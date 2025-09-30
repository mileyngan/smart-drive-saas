import api from './api';

const API_URL = '/instructor';

/**
 * Fetches the list of students assigned to the logged-in instructor.
 * @returns {Promise<object>} The response from the API.
 */
const getAssignedStudents = () => {
  return api.get(`${API_URL}/students`);
};

/**
 * Fetches the detailed file (progress) for a specific student.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<object>} The response from the API.
 */
const getStudentFile = (studentId) => {
  return api.get(`${API_URL}/students/${studentId}/file`);
};

/**
 * Updates a student's practical progress for a specific chapter.
 * @param {object} progressData - The data for the progress update.
 * @returns {Promise<object>} The response from the API.
 */
const updateStudentProgress = (progressData) => {
  return api.put(`${API_URL}/students/${progressData.studentId}/progress`, progressData);
};

const instructorService = {
  getAssignedStudents,
  getStudentFile,
  updateStudentProgress,
};

export default instructorService;