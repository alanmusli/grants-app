const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateCAS } = require('../middleware/authMiddleware');

// GET /api/auth/callback
// Triggered when FINKI CAS redirects the user back to the application.
// The authenticateCAS middleware intercepts this to validate the ticket.
router.get('/callback', authenticateCAS, authController.casCallback);

// POST /api/auth/logout
// Destroys the local secure session and redirects to the central CAS logout.
router.post('/logout', authController.logout);

module.exports = router;