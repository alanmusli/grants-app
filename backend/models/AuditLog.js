const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actionType: {
        type: String,
        enum: [
            'AUTH_SUCCESS', 
            'AUTH_FAILURE', 
            'APP_SUBMIT', 
            'STATUS_CHANGE', 
            'REPORT_SUBMIT', 
            'FINANCE_UPDATE', 
            'RULE_UPDATE',
            'LOGOUT'
        ],
        required: true
    },
    userId: {
        type: String, 
        required: true // Stored as string in case of failed logins where User ID doesn't exist
    },
    ipAddress: {
        type: String,
        required: true
    },
    actionDetails: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // AUTOMATIC DELETION: MongoDB will automatically delete documents 90 days after creation
        expires: '90d' 
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);