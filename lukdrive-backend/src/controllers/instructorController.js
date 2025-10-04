const supabase = require('../config/database');

/**
 * @desc    Get all students assigned to the logged-in instructor
 * @route   GET /api/instructor/students
 * @access  Private (Instructor)
 */
exports.getStudents = async (req, res) => {
    const instructorId = req.user.id;

    try {
        const { data: students, error } = await supabase
            .from('instructor_assignments')
            .select(`
                student:users (id, first_name, last_name, email, created_at)
            `)
            .eq('instructor_id', instructorId);

        if (error) throw error;

        // The data is nested, so we extract the student objects
        const studentList = students.map(s => s.student);
        res.status(200).json(studentList);
    } catch (error) {
        console.error('Error fetching students for instructor:', error);
        res.status(500).json({ message: 'Server error while fetching students.' });
    }
};

/**
 * @desc    Get a specific student's file (progress across all chapters)
 * @route   GET /api/instructor/students/:id/file
 * @access  Private (Instructor)
 */
exports.getStudentFile = async (req, res) => {
    const { id: studentId } = req.params;
    const schoolId = req.user.school_id;

    try {
        // First, verify the student belongs to the instructor's school for security
        const { data: student, error: studentError } = await supabase
            .from('users')
            .select('id')
            .eq('id', studentId)
            .eq('school_id', schoolId)
            .single();

        if (studentError || !student) {
            return res.status(404).json({ message: 'Student not found in your school.' });
        }

        // Get the student's enrolled program and their progress
        const { data: progress, error: progressError } = await supabase
            .from('student_progress')
            .select(`
                chapter:chapters (id, chapter_number, title),
                ebook_completed,
                video_completed,
                quiz_score,
                quiz_passed,
                practical_tasks_completed,
                instructor_notes
            `)
            .eq('student_id', studentId)
            .order('chapter_number', { foreignTable: 'chapters', ascending: true });

        if (progressError) throw progressError;

        res.status(200).json(progress);

    } catch (error) {
        console.error('Error fetching student file:', error);
        res.status(500).json({ message: 'Server error while fetching student file.' });
    }
};

/**
 * @desc    Update a student's practical progress or add notes
 * @route   PUT /api/instructor/students/:id/progress
 * @access  Private (Instructor)
 */
exports.updateStudentProgress = async (req, res) => {
    const { id: studentId } = req.params;
    const { chapter_id, practical_tasks_completed, instructor_notes } = req.body;
    const instructorId = req.user.id;

    if (!chapter_id) {
        return res.status(400).json({ message: 'Chapter ID is required to update progress.' });
    }

    try {
        // Verify this instructor is assigned to this student
        const { data: assignment, error: assignmentError } = await supabase
            .from('instructor_assignments')
            .select('id')
            .eq('instructor_id', instructorId)
            .eq('student_id', studentId)
            .single();

        if (assignmentError || !assignment) {
            return res.status(403).json({ message: 'You are not authorized to update this student\'s progress.' });
        }

        // Build the object with only the fields that are being updated
        const updateData = {};
        if (practical_tasks_completed !== undefined) updateData.practical_tasks_completed = practical_tasks_completed;
        if (instructor_notes !== undefined) updateData.instructor_notes = instructor_notes;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No progress data provided to update.' });
        }

        const { data, error } = await supabase
            .from('student_progress')
            .update(updateData)
            .eq('student_id', studentId)
            .eq('chapter_id', chapter_id)
            .select();

        if (error) throw error;

        res.status(200).json({ message: 'Student progress updated successfully.', data });

    } catch (error) {
        console.error('Error updating student progress:', error);
        res.status(500).json({ message: 'Server error while updating student progress.' });
    }
};

/**
 * @desc    Update the logged-in instructor's profile
 * @route   PUT /api/instructor/profile
 * @access  Private (Instructor)
 */
exports.updateProfile = async (req, res) => {
    const { availability, teaching_license_url } = req.body;
    const instructorId = req.user.id;

    const updateData = {};
    if (availability) updateData.availability = availability;
    if (teaching_license_url) updateData.teaching_license_url = teaching_license_url;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No profile data provided to update.' });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', instructorId)
            .select('id, first_name, last_name, email, availability, teaching_license_url')
            .single();

        if (error) throw error;

        res.status(200).json({ message: 'Profile updated successfully.', user: data });
    } catch (error) {
        console.error('Error updating instructor profile:', error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};

/**
 * @desc    Upload a teaching license file
 * @route   POST /api/instructor/profile/license
 * @access  Private (Instructor)
 */
exports.uploadLicense = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const file = req.file;
    const fileName = `licenses/${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;

    try {
        const { data, error } = await supabase.storage
            .from('licenses')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true, // Overwrite if a file with the same name exists
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('licenses')
            .getPublicUrl(fileName);

        res.status(200).json({
            message: 'License uploaded successfully!',
            filePath: data.path,
            publicUrl: publicUrl,
        });

    } catch (error) {
        console.error('Error uploading license file:', error);
        res.status(500).json({ message: 'Server error while uploading license.' });
    }
};