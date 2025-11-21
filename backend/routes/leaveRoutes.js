const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.get('/all', protect, admin, getAllLeaves);
router.put('/:id/status', protect, admin, updateLeaveStatus);

module.exports = router;
