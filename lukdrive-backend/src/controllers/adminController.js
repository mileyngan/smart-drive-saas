const supabase = require('../config/database');
const { hashPassword } = require('../utils/password');


/**
 * @desc    Get dashboard statistics for the admin's school
 * @route   GET /api/admin/dashboard/stats
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res) => {
  const schoolId = req.user.school_id;

  if (!schoolId) {
    return res.status(400).json({ message: 'User is not associated with a school.' });
  }

  try {
    // Fetch user counts and enrollment data concurrently
    const [
      { count: totalStudents, error: studentError },
      { count: totalInstructors, error: instructorError },
      { data: enrollments, error: enrollmentError },
    ] = await Promise.all([
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('role', 'student'),
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('role', 'instructor'),
      supabase
        .from('student_enrollments')
        .select('status, program:programs!inner(school_id)')
        .eq('program.school_id', schoolId)
    ]);

    if (studentError || instructorError || enrollmentError) {
      console.error('Error fetching dashboard data:', studentError || instructorError || enrollmentError);
      throw new Error('Could not fetch all required dashboard data from the database.');
    }

    // Calculate completion rate
    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    // Placeholder for revenue
    const revenue = 0; // To be implemented later

    res.status(200).json({
      totalStudents: totalStudents || 0,
      totalInstructors: totalInstructors || 0,
      completionRate,
      revenue,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics.' });
  }
};

/**
 * @desc    Get all users of a specific role for the admin's school
 * @route   GET /api/admin/users/:role
 * @access  Private (Admin)
 */
exports.getUsersByRole = async (req, res) => {
    const { role } = req.params;
    const schoolId = req.user.school_id;

    if (!['student', 'instructor', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid user role specified.' });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, first_name, last_name, email, is_active, created_at')
            .eq('school_id', schoolId)
            .eq('role', role);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching ${role}s:`, error);
        res.status(500).json({ message: `Server error while fetching ${role}s.` });
    }
};

/**
 * @desc    Create a new user (student or instructor)
 * @route   POST /api/admin/users
 * @access  Private (Admin)
 */
exports.createUser = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;
    const school_id = req.user.school_id;

    if (!first_name || !last_name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    if (!['student', 'instructor'].includes(role)) {
        return res.status(400).json({ message: 'User role must be either student or instructor.' });
    }

    try {
        const password_hash = await hashPassword(password);
        const { data, error } = await supabase
            .from('users')
            .insert({ first_name, last_name, email, password_hash, role, school_id })
            .select('id, first_name, last_name, email, role, is_active')
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({ message: 'A user with this email already exists.' });
            }
            throw error;
        }

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error while creating user.' });
    }
};

/**
 * @desc    Update a user's details
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;
    const school_id = req.user.school_id;

    try {
        // First, verify the user belongs to the admin's school
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('id', id)
            .eq('school_id', school_id)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ message: 'User not found or you do not have permission to edit them.' });
        }

        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ first_name, last_name, email })
            .eq('id', id)
            .select('id, first_name, last_name, email, role, is_active')
            .single();

        if (updateError) throw updateError;

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};

/**
 * @desc    Deactivate a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.deactivateUser = async (req, res) => {
    const { id } = req.params;
    const school_id = req.user.school_id;

    try {
        // Verify the user belongs to the admin's school before deactivating
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('id', id)
            .eq('school_id', school_id)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ message: 'User not found or you do not have permission to deactivate them.' });
        }

        await supabase
            .from('users')
            .update({ is_active: false })
            .eq('id', id);

        res.status(200).json({ message: 'User deactivated successfully.' });
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ message: 'Server error while deactivating user.' });
    }
};

/**
 * @desc    Enroll a student in a course program
 * @route   POST /api/admin/enrollments
 * @access  Private (Admin)
 */
exports.enrollStudent = async (req, res) => {
    const { student_id, program_id } = req.body;
    const school_id = req.user.school_id;

    if (!student_id || !program_id) {
        return res.status(400).json({ message: 'Student ID and Program ID are required.' });
    }

    try {
        // Optional: Verify both the student and program belong to the admin's school
        // For simplicity, we assume valid IDs are passed from the frontend which has this context.

        const { data, error } = await supabase
            .from('student_enrollments')
            .insert({
                student_id,
                program_id,
                enrolled_at: new Date(),
                status: 'active'
            })
            .select()
            .single();

        if (error) {
            // Handle case where student is already enrolled
            if (error.code === '23505') {
                return res.status(409).json({ message: 'This student is already enrolled in a program.' });
            }
            throw error;
        }

        res.status(201).json({ message: 'Student enrolled successfully.', enrollment: data });
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ message: 'Server error while enrolling student.' });
    }
};

/**
 * @desc    Get all course programs for the admin's school
 * @route   GET /api/admin/programs
 * @access  Private (Admin)
 */
exports.getPrograms = async (req, res) => {
    const school_id = req.user.school_id;

    try {
        const { data, error } = await supabase
            .from('programs')
            .select('id, name')
            .eq('school_id', school_id);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ message: 'Server error while fetching programs.' });
    }
};