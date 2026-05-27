const axios = require('axios');

// CAS Authentication Middleware
// async function authenticateCAS(req, res, next) {
//     // if (req.session && req.session.user) {
//     //     return next(); // User is already authenticated
//     // }

//     // const ticket = req.query.ticket;
//     // if (!ticket) {
//     //     return res.status(401).json({ error: "Authentication required", redirectUrl: "https://cas.finki.ukim.mk/login?service=https://stgs.finki.ukim.mk/api/auth/callback" });
//     // }

//     // try {
//     //     // Validate ticket with FINKI CAS
//     //     const validationUrl = `https://cas.finki.ukim.mk/serviceValidate?ticket=${ticket}&service=https://stgs.finki.ukim.mk/api/auth/callback`;
//     //     const response = await axios.get(validationUrl);
        
//     //     // Very basic XML parsing simulation (in reality, use an XML parser like xml2js)
//     //     if (response.data.includes('cas:authenticationSuccess')) {
//     //         const username = response.data.match(/<cas:user>(.*?)<\/cas:user>/)[1];
            
//     //         // Map to internal RBAC (mock database call)
//     //         req.session.user = {
//     //             username: username,
//     //             role: getInternalRoleFromDB(username), // e.g., 'Naucnik', 'Dekanat', 'Finansii'
//     //             createdAt: Date.now()
//     //         };
//     //         return next();
//     //     } else {
//     //         return res.status(401).json({ error: "Invalid CAS ticket" });
//     //     }
//     // } catch (error) {
//     //     return res.status(500).json({ error: "CAS validation failed" });
//     // }
// }

async function authenticateCAS(req, res, next) {
    // MOCK LOGIN BYPASS
    if (!req.session.user) {
        req.session.user = {
            username: 'mock_user',
            role: 'Деканат', // Change this to 'Научник' or 'Финансии' to test different UI views
            createdAt: Date.now()
        };
    }
    return next();
}

// RBAC Middleware
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session.user || !allowedRoles.includes(req.session.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient privileges." });
        }
        next();
    };
}

function getInternalRoleFromDB(username) {
    // Mock mapping logic
    if (username.includes('dekanat')) return 'Dekanat';
    if (username.includes('finansii')) return 'Finansii';
    return 'Naucnik'; // Default to professor/assistant
}

module.exports = { authenticateCAS, authorizeRoles };