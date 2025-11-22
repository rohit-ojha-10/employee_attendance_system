const Attendance = require('../models/Attendance');

// @desc    Punch In
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    try {
        let attendance = await Attendance.findOne({ user: userId, date: today });

        if (attendance) {
            return res.status(400).json({ message: 'Already checked in for today' });
        }

        attendance = await Attendance.create({
            user: userId,
            date: today,
            checkIn: new Date(),
            status: 'Present',
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Punch Out
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    try {
        const attendance = await Attendance.findOne({ user: userId, date: today });

        if (!attendance) {
            return res.status(400).json({ message: 'You have not checked in yet' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out for today' });
        }

        attendance.checkOut = new Date();

        // Calculate work hours
        const duration = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60); // in hours
        attendance.workHours = duration.toFixed(2);

        // Handle Task Hours
        const { taskHours } = req.body;
        if (taskHours && Array.isArray(taskHours)) {
            const totalTaskHours = taskHours.reduce((acc, curr) => acc + Number(curr.hours), 0);

            // Allow a small margin of error (e.g., 0.1 hours) for floating point comparisons or user estimation
            if (totalTaskHours > duration + 0.1) {
                return res.status(400).json({
                    message: `Total task hours (${totalTaskHours.toFixed(2)}) cannot exceed work hours (${duration.toFixed(2)})`
                });
            }
            attendance.taskHours = taskHours;
        }

        await attendance.save();

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get My Attendance
// @route   GET /api/attendance/my-attendance
// @access  Private
const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { checkIn, checkOut, getMyAttendance };
