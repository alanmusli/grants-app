const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { authenticateCAS, authorizeRoles } = require('../middleware/authMiddleware');
const { sanitizeInput } = require('../middleware/securityMiddleware');

router.use(authenticateCAS);
router.use(sanitizeInput);

// GET /api/finances/budget
// Allows authenticated users to view their remaining annual budget (100,000 MKD limit).
router.get(
    '/budget', 
    financeController.getBudgetOverview
);

// POST /api/finances/calculate-per-diem
// Automated calculation endpoint based on dynamic rules. Accessible to scientists drafting apps.
router.post(
    '/calculate-per-diem', 
    authorizeRoles('Научник', 'Деканат', 'Финансии'),
    financeController.calculatePerDiem
);

// POST /api/finances/record-payment
// Strictly limited to the Finance department to record advance payments and refunds.
router.post(
    '/record-payment', 
    authorizeRoles('Финансии'), 
    financeController.processPaymentRecord
);

module.exports = router;