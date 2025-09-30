const multer = require('multer');
const supabase = require('../config/database');
const path = require('path');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    const allowedTypes = /pdf|mp4/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File type not allowed. Only PDF and MP4 are supported.'));
  },
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

/**
 * @desc    Uploads a file to the appropriate Supabase Storage bucket
 * @route   POST /api/files/upload
 * @access  Private (Admin)
 */
const handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const file = req.file;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const bucket = fileExtension === '.pdf' ? 'ebooks' : 'videos';
  const fileName = `${req.user.school_id}/${Date.now()}-${file.originalname}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    res.status(200).json({
      message: 'File uploaded successfully!',
      filePath: data.path,
      publicUrl: publicUrl,
    });

  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    res.status(500).json({ message: 'Server error while uploading file.' });
  }
};

module.exports = {
  upload,
  handleUpload,
};