const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: String, // Storing as YYYY-MM-DD for easy querying
        required: true,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half-day'],
        default: 'Present',
    },
    workHours: {
        type: Number, // Duration in hours
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
