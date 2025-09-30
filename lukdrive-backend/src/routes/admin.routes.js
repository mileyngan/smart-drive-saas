const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes in this file are protected and restricted to 'admin' role.
router.use(protect);
router.use(authorize('admin'));

// @route   GET api/admin/dashboard/stats
// @desc    Get dashboard statistics for the admin's school
// @access  Private (Admin)
router.get('/dashboard/stats', adminController.getDashboardStats);

// -- User Management Routes --

// @route   GET api/admin/users/:role
// @desc    Get all users of a specific role for the admin's school
// @access  Private (Admin)
router.get('/users/:role', adminController.getUsersByRole);

// @route   POST api/admin/users
// @desc    Create a new user (student or instructor)
// @access  Private (Admin)
router.post('/users', adminController.createUser);

// @route   PUT api/admin/users/:id
// @desc    Update a user's details
// @access  Private (Admin)
router.put('/users/:id', adminController.updateUser);

// @route   DELETE api/admin/users/:id
// @desc    Deactivate a user
// @access  Private (Admin)
router.delete('/users/:id', adminController.deactivateUser);

// -- Enrollment Routes --

// @route   POST api/admin/enrollments
// @desc    Enroll a student in a course program
// @access  Private (Admin)
router.post('/enrollments', adminController.enrollStudent);

// @route   GET api/admin/programs
// @desc    Get all course programs for the admin's school
// @access  Private (Admin)
router.get('/programs', adminController.getPrograms);


module.exports = router;