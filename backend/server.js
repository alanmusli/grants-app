require('dotenv').config(); // Load environment variables first
const express = require('express');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');

const app = express();

// --- Middleware ---

// 1. CORS Configuration (Must be first to allow cross-origin requests)
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    credentials: true // Crucial for session cookies to work across ports
}));

// 2. Body Parser
app.use(express.json());

// 3. Session Management
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Resets maxAge on every request
    cookie: {
        maxAge: 30 * 60 * 1000, // 30 minutes idle timeout
        secure: true,           // CRITICAL: Must be true because backend is HTTPS
        sameSite: 'none',       // CRITICAL: Allows the cookie to be sent to http://localhost:5173
        httpOnly: true          // Prevents client-side JS from reading the cookie for security
    }
}));

// 4. Absolute 12-hour timeout check
app.use((req, res, next) => {
    if (req.session && req.session.createdAt) {
        const timeElapsed = Date.now() - req.session.createdAt;
        if (timeElapsed > 12 * 60 * 60 * 1000) {
            req.session.destroy();
            return res.status(401).json({ error: "Absolute session timeout (12 hours) reached." });
        }
    } else if (req.session) {
        // Initialize createdAt timer on first session creation
        req.session.createdAt = Date.now();
    }
    next();
});

// --- PROTOTYPE MOCK AUTHENTICATION ROUTES ---
app.post('/api/auth/mock-login', (req, res) => {
    const { role } = req.body;
    // Create a fake CAS session
    req.session.user = {
        casUsername: `demo_${role.toLowerCase()}`,
        role: role
    };
    res.json({ message: "Mock login successful", user: req.session.user });
});

app.get('/api/auth/me', (req, res) => {
    if (req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: "Not logged in" });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out successfully" });
});
// ---------------------------------------------

// --- Main API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// --- HTTPS Server Initialization ---
try {
    const httpsOptions = {
        key: fs.readFileSync('./ssl/private.key'),
        cert: fs.readFileSync('./ssl/certificate.crt'),
        secureProtocol: 'TLSv1_2_method' // Enforces TLS 1.2+ minimum
    };

    https.createServer(httpsOptions, app).listen(443, () => {
        console.log('✅ STGS Secure Server running on port 443');
    });
} catch (error) {
    console.error('❌ Failed to start HTTPS server. Check your SSL files.');
    console.error(error.message);
}