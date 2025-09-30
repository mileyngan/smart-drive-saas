const supabase = require('../config/database');

/**
 * @desc    Get all schools pending approval
 * @route   GET /api/superadmin/schools/pending
 * @access  Private (SuperAdmin)
 */
exports.getPendingSchools = async (req, res) => {
    try {
        const { data: schools, error } = await supabase
            .from('schools')
            .select('*')
            .eq('is_approved', false)
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.status(200).json(schools);
    } catch (error) {
        console.error('Error fetching pending schools:', error);
        res.status(500).json({ message: 'Server error while fetching pending schools.' });
    }
};

/**
 * @desc    Approve a pending school
 * @route   PUT /api/superadmin/schools/:id/approve
 * @access  Private (SuperAdmin)
 */
exports.approveSchool = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('schools')
            .update({
                is_approved: true,
                approval_date: new Date()
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ message: 'School not found.' });
        }

        // Here you might also trigger a welcome email to the school's admin.
        // For now, just confirm the approval.

        res.status(200).json({ message: 'School approved successfully.', school: data[0] });
    } catch (error) {
        console.error('Error approving school:', error);
        res.status(500).json({ message: 'Server error while approving school.' });
    }
};

/**
 * @desc    Reject a pending school
 * @route   PUT /api/superadmin/schools/:id/reject
 * @access  Private (SuperAdmin)
 */
exports.rejectSchool = async (req, res) => {
    const { id } = req.params;
    // In a real app, you might want a reason for rejection.
    // For simplicity, we will delete the school and its admin.

    try {
        // It's good practice to wrap this in a transaction if possible,
        // but Supabase JS library doesn't support multi-table transactions easily.
        // We'll proceed with sequential deletions.

        // First, delete associated users (admins) to maintain data integrity
        const { error: userError } = await supabase
            .from('users')
            .delete()
            .eq('school_id', id);

        if (userError) {
            // If this fails, we don't want to leave an orphaned school.
            // Log the error but proceed to delete the school anyway.
            console.error('Could not delete associated admin user during rejection:', userError);
        }

        // Then, delete the school
        const { data, error: schoolError } = await supabase
            .from('schools')
            .delete()
            .eq('id', id);

        if (schoolError) throw schoolError;

        if (data.length === 0) {
            return res.status(404).json({ message: 'School not found.' });
        }

        res.status(200).json({ message: 'School rejected and deleted successfully.' });
    } catch (error) {
        console.error('Error rejecting school:', error);
        res.status(500).json({ message: 'Server error while rejecting school.' });
    }
};