const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// All routes in this file are protected and restricted to 'admin' role.
router.use(protect);
router.use(authorize('admin'));

// @route   POST api/courses
// @desc    Create a new course (program)
// @access  Private (Admin)
router.post('/', courseController.createCourse);

// @route   GET api/courses/:courseId/chapters
// @desc    Get all chapters for a specific course
// @access  Private (Admin)
router.get('/:courseId/chapters', courseController.getChaptersByCourse);

// @route   POST api/courses/:courseId/chapters
// @desc    Add a chapter to a course
// @access  Private (Admin)
router.post('/:courseId/chapters', courseController.addChapter);

// @route   POST api/courses/quiz/generate
// @desc    Generate a quiz for a chapter using AI
// @access  Private (Admin)
router.post('/quiz/generate', courseController.generateQuiz);

// @route   POST api/courses/quiz
// @desc    Save a quiz for a chapter
// @access  Private (Admin)
router.post('/quiz', courseController.saveQuiz);

module.exports = router;