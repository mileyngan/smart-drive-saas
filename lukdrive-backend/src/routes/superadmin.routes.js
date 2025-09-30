const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all superadmin routes and restrict to 'superadmin' role
router.use(protect);
router.use(authorize('superadmin'));

// @route   GET api/superadmin/schools/pending
// @desc    Get all schools pending approval
// @access  Private (SuperAdmin)
router.get('/schools/pending', superadminController.getPendingSchools);

// @route   PUT api/superadmin/schools/:id/approve
// @desc    Approve a pending school
// @access  Private (SuperAdmin)
router.put('/schools/:id/approve', superadminController.approveSchool);

// @route   PUT api/superadmin/schools/:id/reject
// @desc    Reject a pending school
// @access  Private (SuperAdmin)
router.put('/schools/:id/reject', superadminController.rejectSchool);

module.exports = router;