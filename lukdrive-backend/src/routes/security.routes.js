const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { protect, authorize } = require('../middleware/auth');

// Protect all security routes and restrict to 'student' role for logging
router.use(protect);
router.use(authorize('student'));

// @route   POST /api/security/log
// @desc    Log a security incident
// @access  Private (Student)
router.post('/log', securityController.logIncident);

module.exports = router;