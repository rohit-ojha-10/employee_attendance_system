const Leave = require('../models/Leave');

// @desc    Apply for Leave
// @route   POST /api/leaves/apply
// @access  Private
const applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    try {
        const leave = await Leave.create({
            user: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get My Leaves
// @route   GET /api/leaves/my-leaves
// @access  Private
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get All Leaves (Admin)
// @route   GET /api/leaves/all
// @access  Private/Admin
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({}).populate('user', 'name email');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update Leave Status (Admin)
// @route   PUT /api/leaves/:id/status
// @access  Private/Admin
const updateLeaveStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status;
        await leave.save();

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
