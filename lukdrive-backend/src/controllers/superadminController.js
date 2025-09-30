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
            .eq('status', 'pending')
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
                status: 'approved',
                approval_date: new Date()
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ message: 'School not found.' });
        }

        // TODO: Trigger a welcome email to the school's admin.

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
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({ message: 'A reason for rejection is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('schools')
            .update({
                status: 'rejected',
                rejection_reason: reason
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'School not found.' });
        }

        // TODO: Trigger a rejection email to the school's admin.

        res.status(200).json({ message: 'School rejected successfully.', school: data[0] });
    } catch (error) {
        console.error('Error rejecting school:', error);
        res.status(500).json({ message: 'Server error while rejecting school.' });
    }
};