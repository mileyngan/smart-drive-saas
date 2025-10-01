const chatbotService = require('../services/chatbotService');

/**
 * @desc    Get a response from the AI chatbot
 * @route   POST /api/chatbot/ask
 * @access  Private (Student)
 */
exports.ask = async (req, res) => {
    const { query, context } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'A query is required.' });
    }

    try {
        const response = await chatbotService.getChatbotResponse(query, context);
        res.status(200).json({ response });
    } catch (error) {
        console.error('Error in chatbot controller:', error);
        res.status(500).json({ message: error.message || 'Server error while getting chatbot response.' });
    }
};