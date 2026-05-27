const multer = require('multer');

// Store files in memory so they can be AES-256 encrypted before writing to disk/DB [cite: 348]
const storage = multer.memoryStorage();

/**
 * Middleware for initial grant applications.
 * Limit: 10MB per document. Formats: PDF, DOCX, JPG[cite: 276].
 */
const applicationUpload = multer({
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB strict limit
        files: 10 // Reasonable max number of files per request
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
            'image/jpeg'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file format. Only PDF, DOCX, and JPG are allowed."));
        }
    }
});

/**
 * Middleware for post-travel financial reports.
 * Limit: 20MB per document. Format: strictly PDF[cite: 292, 293].
 */
const reportUpload = multer({
    storage: storage,
    limits: { 
        fileSize: 20 * 1024 * 1024, // 20MB strict limit
        files: 1 // Single report file expected
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file format. Only PDF is allowed for reports."));
        }
    }
});

// Error handling wrapper for Multer to return clean JSON responses
const handleUploadError = (uploadMiddleware) => {
    return (req, res, next) => {
        uploadMiddleware(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading (e.g., file too large).
                return res.status(400).json({ error: `Upload error: ${err.message}` });
            } else if (err) {
                // An unknown error occurred.
                return res.status(500).json({ error: `System error during upload: ${err.message}` });
            }
            // Everything went fine.
            next();
        });
    };
};

module.exports = {
    uploadApplicationDocs: handleUploadError(applicationUpload.array('documents')),
    uploadTravelReport: handleUploadError(reportUpload.single('reportDocument'))
};