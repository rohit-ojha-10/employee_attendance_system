const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    condition: {
        type: String, // e.g., "ABSENT_COUNT > 3"
        required: true,
    },
    action: {
        type: String, // e.g., "BLOCK_ACCESS", "SEND_ALERT"
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Rule', ruleSchema);
