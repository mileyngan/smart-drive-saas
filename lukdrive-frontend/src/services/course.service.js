import api from './api';

const API_URL = '/courses';
const FILE_API_URL = '/files';

/**
 * Creates a new program (course).
 * @param {object} programData - The data for the new program.
 * @returns {Promise<object>} The response from the API.
 */
const createProgram = (programData) => {
  return api.post(API_URL, programData);
};

/**
 * Fetches all programs for the school.
 * @returns {Promise<object>} The response from the API.
 */
const getPrograms = () => {
    // This re-uses an existing endpoint from the admin service, but is aliased here for clarity
    return api.get('/admin/programs');
};

/**
 * Fetches all chapters for a specific program.
 * @param {string} programId - The ID of the program.
 * @returns {Promise<object>} The response from the API.
 */
const getChapters = (programId) => {
  return api.get(`${API_URL}/${programId}/chapters`);
};

/**
 * Adds a new chapter to a program.
 * @param {string} programId - The ID of the program.
 * @param {object} chapterData - The data for the new chapter, including public URLs.
 * @returns {Promise<object>} The response from the API.
 */
const addChapter = (programId, chapterData) => {
  return api.post(`${API_URL}/${programId}/chapters`, chapterData);
};

/**
 * Uploads a file (eBook or video) to storage.
 * @param {FormData} formData - The form data containing the file.
 * @returns {Promise<object>} The response containing the public URL.
 */
const uploadFile = (formData) => {
  return api.post(`${FILE_API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const courseService = {
  createProgram,
  getPrograms,
  getChapters,
  addChapter,
  uploadFile,
};

export default courseService;