const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/auth');

// Protect all instructor routes and restrict to 'instructor' role
router.use(protect);
router.use(authorize('instructor'));

// @route   GET api/instructor/students
// @desc    Get all students assigned to the instructor's school
// @access  Private (Instructor)
router.get('/students', instructorController.getStudents);

// @route   GET api/instructor/students/:id/file
// @desc    Get a specific student's file (progress)
// @access  Private (Instructor)
router.get('/students/:id/file', instructorController.getStudentFile);

// @route   PUT api/instructor/students/:id/progress
// @desc    Update a student's practical progress
// @access  Private (Instructor)
router.put('/students/:id/progress', instructorController.updateStudentProgress);


module.exports = router;