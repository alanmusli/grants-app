// authController.js

/**
 * Handles the redirect back from the FINKI CAS system.
 * Assuming the authMiddleware has already validated the ticket and attached req.session.user.
 */
exports.casCallback = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "CAS Authentication failed." });
    }
    
    // Log successful authentication
    logAudit('AUTH_SUCCESS', req.session.user.id, req.ip, 'User successfully authenticated via CAS.');
    
    // Redirect to the frontend application 
    res.redirect('https://stgs-client.finki.ukim.mk/dashboard');
};

/**
 * Destroys the local session and redirects to the central CAS logout.
 */
exports.logout = (req, res) => {
    const userId = req.session.user?.id || 'Unknown';
    
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out locally." });
        }
        
        logAudit('LOGOUT', userId, req.ip, 'User requested logout.');
        
        // Clear the cookie and redirect to central CAS logout
        res.clearCookie('connect.sid'); 
        res.redirect('https://cas.finki.ukim.mk/logout?service=https://stgs.finki.ukim.mk');
    });
};