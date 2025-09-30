const express = require('express');
const router = express.Router();
const { upload, handleUpload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

// Protect all file upload routes and restrict to admins
router.use(protect);
router.use(authorize('admin'));

// @route   POST /api/files/upload
// @desc    Upload a file (eBook or video) to Supabase Storage
// @access  Private (Admin)
router.post('/upload', upload.single('file'), handleUpload);

module.exports = router;