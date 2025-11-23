const axios = require('axios');

const DOTNET_SERVICE_URL = 'http://localhost:5192/api/system';

// @desc    Trigger Reconciliation
// @route   POST /api/system/reconcile
// @access  Private/Admin
const reconcile = async (req, res) => {
    try {
        const response = await axios.post(`${DOTNET_SERVICE_URL}/reconcile`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error communicating with .NET service' });
    }
};

// @desc    Trigger Productivity Calculation
// @route   POST /api/system/calculate-productivity
// @access  Private/Admin
const calculateProductivity = async (req, res) => {
    try {
        const response = await axios.post(`${DOTNET_SERVICE_URL}/calculate-productivity`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error communicating with .NET service' });
    }
};

// @desc    Trigger Rule Evaluation
// @route   POST /api/system/evaluate-rules
// @access  Private/Admin
const evaluateRules = async (req, res) => {
    try {
        const response = await axios.post(`${DOTNET_SERVICE_URL}/evaluate-rules`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error communicating with .NET service' });
    }
};

// @desc    Run All System Checks
// @route   POST /api/system/run-all
// @access  Private/Admin
const runAll = async (req, res) => {
    try {
        const response = await axios.post(`${DOTNET_SERVICE_URL}/run-all`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error communicating with .NET service' });
    }
};

module.exports = { reconcile, calculateProductivity, evaluateRules, runAll };
