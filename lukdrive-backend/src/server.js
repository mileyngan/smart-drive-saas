const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Load environment variables from config.env, which is in the parent directory
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

// Route imports
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const courseRoutes = require('./routes/course.routes');
const fileRoutes = require('./routes/file.routes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/student', require('./routes/student.routes'));
app.use('/api/instructor', require('./routes/instructor.routes'));
app.use('/api/superadmin', require('./routes/superadmin.routes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('LukDrive API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;