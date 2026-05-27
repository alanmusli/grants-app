const crypto = require('crypto');
const emailService = require('../services/emailService');
const { logAudit } = require('../services/auditService');

// Basic sanitization function to prevent XSS (removes HTML tags)
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>?/gm, '').trim();
};

// AES-256 Encryption function for Data-at-Rest
function encryptData(buffer) {
    // Ensure keys exist in .env, otherwise throw a clear error
    if (!process.env.AES_KEY || !process.env.AES_IV) {
        throw new Error("Missing AES_KEY or AES_IV in .env file");
    }
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.AES_KEY, 'hex'), Buffer.from(process.env.AES_IV, 'hex'));
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return encrypted;
}

exports.submitApplication = async (req, res) => {
    try {
        const data = {
            conferenceName: sanitizeInput(req.body.conferenceName),
            paperTitle: sanitizeInput(req.body.paperTitle),
            destination: sanitizeInput(req.body.destination),
            travelDate: sanitizeInput(req.body.travelDate),
            estimatedCosts: parseFloat(req.body.estimatedCosts)
        };

        if (!data.conferenceName || !data.destination || !data.estimatedCosts) {
            return res.status(400).json({ error: "Mandatory fields missing." });
        }

        // Encrypt all uploaded files if they exist
        let encryptedDocuments = [];
        if (req.files && req.files.length > 0) {
            encryptedDocuments = req.files.map(file => ({
                originalName: sanitizeInput(file.originalname),
                mimeType: file.mimetype,
                encryptedData: {
                    iv: process.env.AES_IV, // In production, generate a unique IV per file
                    content: encryptData(file.buffer).toString('hex')
                }
            }));
        }

        // TODO: Mongoose DB save logic goes here...

        // Log the action (safeguard against missing session user)
        const userId = req.session?.user?.username || 'Unknown User';
        await logAudit('APP_SUBMIT', userId, req.ip, `Application submitted for ${data.destination}`);
        
        // Send email to Dean's office
        await emailService.sendNotification('dekanat@finki.ukim.mk', 'New Grant Application Submitted', `A new application for ${data.destination} was submitted.`);

        res.status(201).json({ message: "Application submitted successfully." });
    } catch (err) {
        console.error("Submit App Error:", err);
        res.status(500).json({ error: "Server error processing application." });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status, justification } = req.body;
        
        const cleanJustification = sanitizeInput(justification);
        if (cleanJustification && cleanJustification.length > 500) {
            return res.status(400).json({ error: "Justification cannot exceed 500 characters." });
        }

        const validStatuses = ['во разгледување', 'одобрено', 'одбиено', 'во дополнување'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status." });
        }

        // TODO: Mongoose DB update logic goes here...

        const userId = req.session?.user?.username || 'Unknown User';
        await logAudit('STATUS_CHANGE', userId, req.ip, `Application ${applicationId} status changed to ${status}`);

        // Email applicant
        await emailService.sendNotification('applicant@email.com', 'Application Status Updated', `Your application status is now: ${status}. Reason: ${cleanJustification || 'N/A'}`);

        res.status(200).json({ message: "Status updated successfully." });
    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ error: "Failed to update status." });
    }
};

exports.submitPostTravelReport = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Report PDF is required." });
    
    try {
        const encryptedContent = encryptData(req.file.buffer).toString('hex');
        const encryptedReport = {
            originalName: sanitizeInput(req.file.originalname),
            mimeType: req.file.mimetype,
            encryptedData: {
                iv: process.env.AES_IV,
                content: encryptedContent
            }
        };

        // TODO: Mongoose DB save logic for post-travel report...
        
        const userId = req.session?.user?.username || 'Unknown User';
        await logAudit('REPORT_SUBMIT', userId, req.ip, `Report submitted for application ${req.body.applicationId}`);
        
        res.status(200).json({ message: "Report successfully attached." });
    } catch (err) {
        console.error("Report Upload Error:", err);
        res.status(500).json({ error: "Failed to upload report." });
    }
};