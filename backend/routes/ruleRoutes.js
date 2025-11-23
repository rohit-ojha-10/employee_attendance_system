const express = require('express');
const router = express.Router();
const { getRules, createRule, deleteRule } = require('../controllers/ruleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getRules).post(protect, admin, createRule);
router.route('/:id').delete(protect, admin, deleteRule);

module.exports = router;
