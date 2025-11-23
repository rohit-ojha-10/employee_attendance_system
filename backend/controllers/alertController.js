const Alert = require('../models/Alert');

// @desc    Get My Alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user._id, isResolved: false }).sort({ generatedAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getAlerts };
