import api from './api';

const API_URL = '/superadmin';

/**
 * Fetches the list of schools pending approval.
 * @returns {Promise<object>} The response from the API.
 */
const getPendingSchools = () => {
  return api.get(`${API_URL}/schools/pending`);
};

/**
 * Sends a request to approve a school.
 * @param {string} schoolId - The ID of the school to approve.
 * @returns {Promise<object>} The response from the API.
 */
const approveSchool = (schoolId) => {
  return api.put(`${API_URL}/schools/${schoolId}/approve`);
};

/**
 * Sends a request to reject a school.
 * @param {string} schoolId - The ID of the school to reject.
 * @param {string} reason - The reason for rejection.
 * @returns {Promise<object>} The response from the API.
 */
const rejectSchool = (schoolId, reason) => {
  return api.put(`${API_URL}/schools/${schoolId}/reject`, { reason });
};

const superadminService = {
  getPendingSchools,
  approveSchool,
  rejectSchool,
};

export default superadminService;