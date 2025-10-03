import api from './api';

const API_URL = '/security';

/**
 * Logs a security incident to the backend.
 * @param {object} incidentData - The data for the incident (e.g., { incident_type, details }).
 * @returns {Promise<object>} The response from the API.
 */
const logIncident = (incidentData) => {
  return api.post(`${API_URL}/log`, incidentData);
};

const securityService = {
  logIncident,
};

export default securityService;