const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateCAS, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateCAS);

// GET /api/admin/audit-logs
// Only system administrators can view the masked audit logs.
// router.get(
//     '/audit-logs', 
//     authorizeRoles('Администратор'), 
//     adminController.getAuditLogs
// );


router.get('/audit-logs', (req, res) => {
    res.json([
        { id: 1, createdAt: new Date(), actionType: 'LOGIN_SUCCESS', userId: 'demo_admin', ipAddress: '127.0.0.1', actionDetails: 'User logged in successfully' },
        { id: 2, createdAt: new Date(), actionType: 'UPDATE_APPLICATION', userId: 'demo_admin', ipAddress: '127.0.0.1', actionDetails: 'Updated grant application #12' }
    ]);
});
// PUT /api/admin/rules
// Allows Administrators and the Finance Department to update per diem rules 
// via the GUI without refactoring the hard code.
router.put(
    '/rules', 
    authorizeRoles('Администратор', 'Финансии'), 
    adminController.updateTravelRules
);

module.exports = router;