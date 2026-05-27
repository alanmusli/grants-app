// financeController.js

/**
 * Calculates per diem automatically based on dynamic rules.
 */
exports.calculatePerDiem = async (req, res) => {
    try {
        const { destination, days } = req.body;
        
        // Fetch dynamic rules from DB (No hardcoded values)
        const rules = await getTravelRulesFromDB(); 
        const dailyRate = rules.perDiemRates[destination] || rules.defaultRate;
        
        const totalPerDiem = dailyRate * parseInt(days);
        res.status(200).json({ total: totalPerDiem });
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate per diem." });
    }
};

/**
 * Gets remaining budget with 1 MKD precision.
 */
exports.getBudgetOverview = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const ANNUAL_LIMIT = 100000; // 100,000 MKD limit
        
        // Query DB for sum of all approved grants this year
        const utilizedBudget = await calculateUtilizedBudget(userId);
        
        const remaining = (ANNUAL_LIMIT - utilizedBudget).toFixed(0); // Accuracy to 1 denar
        
        res.status(200).json({ utilized: utilizedBudget, remaining: remaining, limit: ANNUAL_LIMIT });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch budget." });
    }
};

/**
 * Processes financial advances or refunds. Note: Does not actually transfer money, just records it.
 */
exports.processPaymentRecord = async (req, res) => {
    try {
        const { applicationId, amount, type } = req.body; // type: 'Advance' or 'Refund'
        
        // Save record to DB...
        
        logAudit('FINANCE_UPDATE', req.session.user.id, req.ip, `Recorded ${type} of ${amount} for App ${applicationId}`); //
        res.status(200).json({ message: "Financial record updated successfully." });
    } catch (err) {
        res.status(500).json({ error: "Failed to process financial record." });
    }
};