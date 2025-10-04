const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

// Configure multer for license uploads
const licenseStorage = multer.memoryStorage();
const licenseUpload = multer({
  storage: licenseStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    if (allowedTypes.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('File type not allowed. Only images and PDFs are supported.'));
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// @route   PUT api/instructor/profile
// @desc    Update the instructor's own profile
// @access  Private (Instructor)
router.put('/profile', instructorController.updateProfile);

// @route   POST api/instructor/profile/license
// @desc    Upload a teaching license
// @access  Private (Instructor)
router.post('/profile/license', licenseUpload.single('license'), instructorController.uploadLicense);


module.exports = router;