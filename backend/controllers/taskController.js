const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create Task (Admin)
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
    const { title, description, assignedTo, dueDate, project } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            dueDate,
            project,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get My Tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update Task Status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure user owns the task or is admin
        if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get All Users (Helper for assigning tasks)
// @route   GET /api/tasks/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('name email');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

module.exports = { createTask, getMyTasks, updateTaskStatus, getAllUsers };
