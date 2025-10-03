const supabase = require('../config/database');

/**
 * @desc    Log a security incident
 * @route   POST /api/security/log
 * @access  Private (Student)
 */
exports.logIncident = async (req, res) => {
    const { incident_type, details } = req.body;
    const user_id = req.user.id;

    if (!incident_type) {
        return res.status(400).json({ message: 'Incident type is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('security_incidents')
            .insert({
                user_id,
                incident_type,
                details,
            });

        if (error) throw error;

        res.status(201).json({ message: 'Incident logged successfully.' });
    } catch (error) {
        console.error('Error logging security incident:', error);
        res.status(500).json({ message: 'Server error while logging incident.' });
    }
};