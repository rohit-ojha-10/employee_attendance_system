const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String, // e.g., "RECONCILIATION_MISMATCH", "RULE_VIOLATION"
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isResolved: {
        type: Boolean,
        default: false,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
