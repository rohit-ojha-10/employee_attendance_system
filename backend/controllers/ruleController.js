const Rule = require('../models/Rule');

// @desc    Get All Rules
// @route   GET /api/rules
// @access  Private/Admin
const getRules = async (req, res) => {
    try {
        const rules = await Rule.find();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create Rule
// @route   POST /api/rules
// @access  Private/Admin
const createRule = async (req, res) => {
    const { name, condition, action } = req.body;

    try {
        const rule = await Rule.create({
            name,
            condition,
            action,
        });

        res.status(201).json(rule);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete Rule
// @route   DELETE /api/rules/:id
// @access  Private/Admin
const deleteRule = async (req, res) => {
    try {
        const rule = await Rule.findById(req.params.id);

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        await rule.deleteOne();
        res.json({ message: 'Rule removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getRules, createRule, deleteRule };
