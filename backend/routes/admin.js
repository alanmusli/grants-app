const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateCAS, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateCAS);

// GET /api/admin/audit-logs
// Only system administrators can view the masked audit logs.
router.get(
    '/audit-logs', 
    authorizeRoles('Администратор'), 
    adminController.getAuditLogs
);

// PUT /api/admin/rules
// Allows Administrators and the Finance Department to update per diem rules 
// via the GUI without refactoring the hard code.
router.put(
    '/rules', 
    authorizeRoles('Администратор', 'Финансии'), 
    adminController.updateTravelRules
);

module.exports = router;