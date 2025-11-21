const express = require('express');
const router = express.Router();
const { createTask, getMyTasks, updateTaskStatus, getAllUsers } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createTask);
router.get('/my-tasks', protect, getMyTasks);
router.put('/:id/status', protect, updateTaskStatus);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
