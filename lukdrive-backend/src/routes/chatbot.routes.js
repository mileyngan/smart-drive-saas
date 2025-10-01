const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { protect, authorize } = require('../middleware/auth');

// Protect all chatbot routes and restrict to 'student' role
router.use(protect);
router.use(authorize('student'));

// @route   POST /api/chatbot/ask
// @desc    Ask a question to the AI chatbot
// @access  Private (Student)
router.post('/ask', chatbotController.ask);

module.exports = router;