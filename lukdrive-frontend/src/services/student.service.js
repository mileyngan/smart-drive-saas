import api from './api';

const API_URL = '/student';

/**
 * Fetches the dashboard data for the logged-in student.
 * @returns {Promise<object>} The response from the API.
 */
const getDashboard = () => {
  return api.get(`${API_URL}/dashboard`);
};

/**
 * Fetches the student's currently enrolled program.
 * @returns {Promise<object>} The response from the API.
 */
const getEnrolledProgram = () => {
  return api.get(`${API_URL}/program`);
};

/**
 * Fetches all chapters for the student's program, including their progress.
 * @returns {Promise<object>} The response from the API.
 */
const getChapters = () => {
  return api.get(`${API_URL}/chapters`);
};

/**
 * Updates the student's progress for a specific chapter.
 * @param {object} progressData - The progress data to update (e.g., { chapter_id, ebook_completed }).
 * @returns {Promise<object>} The response from the API.
 */
const updateProgress = (progressData) => {
  return api.post(`${API_URL}/progress`, progressData);
};

/**
 * Fetches the quiz for a specific chapter.
 * @param {string} chapterId - The ID of the chapter.
 * @returns {Promise<object>} The response from the API.
 */
const getQuiz = (chapterId) => {
  return api.get(`${API_URL}/chapter/${chapterId}/quiz`);
};

/**
 * Submits the student's answers for a quiz.
 * @param {object} submissionData - The submission data (e.g., { chapterId, answers }).
 * @returns {Promise<object>} The response containing the score and pass/fail status.
 */
const submitQuiz = (submissionData) => {
  return api.post(`${API_URL}/quiz/submit`, submissionData);
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