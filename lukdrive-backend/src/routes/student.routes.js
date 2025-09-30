const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Protect all student routes and restrict to 'student' role
router.use(protect);
router.use(authorize('student'));

// @route   GET api/student/dashboard
// @desc    Get dashboard data for the logged-in student
// @access  Private (Student)
router.get('/dashboard', studentController.getStudentDashboard);

// @route   GET api/student/program
// @desc    Get the student's enrolled program details
// @access  Private (Student)
router.get('/program', studentController.getEnrolledProgram);

// @route   GET api/student/chapters
// @desc    Get all chapters for the student's program
// @access  Private (Student)
router.get('/chapters', studentController.getChapters);

// @route   POST api/student/progress
// @desc    Update the student's progress on a chapter
// @access  Private (Student)
router.post('/progress', studentController.updateProgress);

// @route   GET api/student/chapter/:chapterId/quiz
// @desc    Get the quiz for a specific chapter
// @access  Private (Student)
router.get('/chapter/:chapterId/quiz', studentController.getQuiz);

// @route   POST api/student/quiz/submit
// @desc    Submit quiz answers and get results
// @access  Private (Student)
router.post('/quiz/submit', studentController.submitQuiz);


module.exports = router;