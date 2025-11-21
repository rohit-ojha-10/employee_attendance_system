const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-attendance', protect, getMyAttendance);

module.exports = router;
