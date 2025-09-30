const supabase = require('../config/database');

/**
 * @desc    Get all students assigned to the instructor's school
 * @route   GET /api/instructor/students
 * @access  Private (Instructor)
 */
exports.getStudents = async (req, res) => {
    const schoolId = req.user.school_id;

    try {
        const { data: students, error } = await supabase
            .from('users')
            .select('id, first_name, last_name, email, created_at')
            .eq('school_id', schoolId)
            .eq('role', 'student')
            .eq('is_active', true);

        if (error) throw error;

        res.status(200).json(students);
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
                chapter:chapters (chapter_number, title),
                ebook_completed,
                video_completed,
                quiz_score,
                practical_completed,
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
    const { chapter_id, practical_completed, instructor_notes } = req.body;
    const schoolId = req.user.school_id;

    if (!chapter_id) {
        return res.status(400).json({ message: 'Chapter ID is required to update progress.' });
    }

    try {
        // Verify student is in the same school
        const { data: student, error: studentError } = await supabase
            .from('users')
            .select('id')
            .eq('id', studentId)
            .eq('school_id', schoolId)
            .single();

        if (studentError || !student) {
            return res.status(404).json({ message: 'Student not found in your school.' });
        }

        // Build the object with only the fields that are being updated
        const updateData = {};
        if (practical_completed !== undefined) updateData.practical_completed = practical_completed;
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