const express = require('express');
const router = express.Router();
const { reconcile, calculateProductivity, evaluateRules, runAll } = require('../controllers/systemController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/reconcile', protect, admin, reconcile);
router.post('/calculate-productivity', protect, admin, calculateProductivity);
router.post('/evaluate-rules', protect, admin, evaluateRules);
router.post('/run-all', protect, admin, runAll);

module.exports = router;
