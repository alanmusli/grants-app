// adminController.js

/**
 * Fetches the audit logs, retaining 90 days of history and masking sensitive data[cite: 349, 356].
 */
exports.getAuditLogs = async (req, res) => {
    try {
        // Fetch logs from DB where date > (Now - 90 days) [cite: 356]
        const rawLogs = await fetchLogsFromDB();
        
        // Mask sensitive data (e.g., specific file names or personal text) before sending to client [cite: 349]
        const maskedLogs = rawLogs.map(log => ({
            ...log,
            userIp: log.userIp.replace(/\d{1,3}$/, '***'), // Mask last IP octet
            actionDetails: log.actionDetails.replace(/(password|secret|key)=([^&]+)/gi, '$1=***') 
        }));

        res.status(200).json(maskedLogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve audit logs." });
    }
};

/**
 * Dynamically updates system parameters (per diems, country rates) 
 * so code does not need to be hardcoded or redeployed[cite: 511, 515].
 */
exports.updateTravelRules = async (req, res) => {
    try {
        const newRules = req.body.rules;
        
        // Input validation for the dynamic rules object...
        
        // Save new rules to the database (configuration table)
        await saveRulesToDB(newRules);
        
        logAudit('RULE_UPDATE', req.session.user.id, req.ip, 'Administrator updated travel rules.');

        res.status(200).json({ message: "Rules updated successfully. System will use new rates immediately." });
    } catch (err) {
        res.status(500).json({ error: "Failed to update travel rules." });
    }
};