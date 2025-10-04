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
    // Fetch user counts concurrently
    const [
      { count: totalStudents, error: studentError },
      { count: totalInstructors, error: instructorError },
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
    ]);

    if (studentError || instructorError) {
      console.error('Error fetching dashboard data:', studentError || instructorError);
      throw new Error('Could not fetch all required dashboard data from the database.');
    }

    // Placeholders for more complex calculations
    const completionRate = 0; // TODO: Implement business logic for completion rate
    const revenue = 0; // TODO: Implement revenue tracking

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
 * @route   POST /api/admin/enroll
 * @access  Private (Admin)
 */
exports.enrollStudent = async (req, res) => {
    const { student_id, program_id } = req.body;
    const school_id = req.user.school_id;

    if (!student_id || !program_id) {
        return res.status(400).json({ message: 'Student ID and Program ID are required.' });
    }

    try {
        // TODO: Add verification to ensure student and program belong to the admin's school
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
            if (error.code === '23505') { // unique constraint violation
                return res.status(409).json({ message: 'This student is already enrolled in this program.' });
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
 * @desc    Log a payment for a student's enrollment
 * @route   POST /api/admin/payments
 * @access  Private (Admin)
 */
exports.logPayment = async (req, res) => {
    const { enrollment_id, student_id, amount, payment_method, notes } = req.body;

    if (!enrollment_id || !student_id || !amount || !payment_method) {
        return res.status(400).json({ message: 'Enrollment ID, Student ID, amount, and payment method are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('payments')
            .insert({ enrollment_id, student_id, amount, payment_method, notes })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Payment logged successfully.', payment: data });
    } catch (error) {
        console.error('Error logging payment:', error);
        res.status(500).json({ message: 'Server error while logging payment.' });
    }
};

/**
 * @desc    Get full details for a single student
 * @route   GET /api/admin/student/:id
 * @access  Private (Admin)
 */
exports.getStudentDetails = async (req, res) => {
    const { id: studentId } = req.params;
    const school_id = req.user.school_id;

    try {
        const { data: student, error: studentError } = await supabase
            .from('users')
            .select(`
                *,
                enrollments:student_enrollments (
                    *,
                    program:programs(*),
                    payments:payments(*)
                )
            `)
            .eq('id', studentId)
            .eq('school_id', school_id)
            .eq('role', 'student')
            .single();

        if (studentError) throw studentError;
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ message: 'Server error while fetching student details.' });
    }
};

/**
 * @desc    Update a school's subscription plan
 * @route   PUT /api/admin/subscription
 * @access  Private (Admin)
 */
exports.updateSubscription = async (req, res) => {
    const { plan } = req.body;
    const school_id = req.user.school_id;

    if (!plan || !['pro', 'enterprise'].includes(plan.toLowerCase())) {
        return res.status(400).json({ message: 'A valid plan (Pro, Enterprise) is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({
                plan: plan.toLowerCase(),
                status: 'active',
                starts_at: new Date(),
                // In a real scenario, ends_at would be calculated based on the plan duration
                ends_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                trial_ends_at: null, // End the trial
            })
            .eq('school_id', school_id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({ message: `Subscription successfully updated to ${plan}.`, subscription: data });

    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ message: 'Server error while updating subscription.' });
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