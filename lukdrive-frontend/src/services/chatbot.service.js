import api from './api';

const API_URL = '/chatbot';

/**
 * Sends a query to the AI chatbot.
 * @param {string} query - The user's question.
 * @param {object} context - Optional context about the user's current state.
 * @returns {Promise<object>} The response from the API containing the chatbot's answer.
 */
const askChatbot = (query, context = {}) => {
  return api.post(`${API_URL}/ask`, { query, context });
};

const chatbotService = {
  askChatbot,
};

export default chatbotService;