// auditService.js
const AuditLog = require('../models/AuditLog');

/**
 * Records system actions for the 90-day retention requirement.
 * * @param {string} actionType - Category of the action (e.g., 'AUTH_SUCCESS', 'STATUS_CHANGE')
 * @param {string} userId - The ID or Username of the actor
 * @param {string} ipAddress - The IP address of the request
 * @param {string} actionDetails - Description of what occurred
 */
exports.logAudit = async (actionType, userId, ipAddress, actionDetails) => {
    try {
        // Create the log entry in the database. 
        // Note: The TTL index on the AuditLog model handles the 90-day deletion automatically.
        await AuditLog.create({
            actionType,
            userId: userId || 'SYSTEM',
            ipAddress: ipAddress || '0.0.0.0',
            actionDetails
        });
        
        // Console output for development monitoring
        console.log(`[AUDIT] ${actionType} | User: ${userId} | IP: ${ipAddress}`);
    } catch (error) {
        // Critical: Logging failures should be caught so they don't break the main application flow,
        // but they must be flagged in server console.
        console.error('CRITICAL: Failed to write to audit log:', error);
    }
};