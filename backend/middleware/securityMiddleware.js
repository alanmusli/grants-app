/**
 * Sanitizes all incoming user data to prevent injection attacks.
 */
function sanitizeInput(req, res, next) {
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                // Remove HTML tags and escape dangerous characters
                obj[key] = obj[key].replace(/<[^>]*>?/gm, '').trim();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
}

/**
 * Validates the request body against predefined server-side schemas.
 */
function validateSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({ error: "Schema validation failed", details: errors });
        }
        next();
    };
}

// Example Schema for Grant Application using a library like Joi (conceptual)
const Joi = require('joi'); // Requires installing 'joi'

const grantApplicationSchema = Joi.object({
    conferenceName: Joi.string().required(),
    paperTitle: Joi.string().required(),
    destination: Joi.string().required(),
    travelDate: Joi.date().iso().required(),
    estimatedCosts: Joi.number().positive().required()
});

const statusUpdateSchema = Joi.object({
    applicationId: Joi.string().required(),
    status: Joi.string().valid('во разгледување', 'одобрено', 'одбиено').required(),
    justification: Joi.string().max(500).allow('', null) // Enforces 500 character limit
});

module.exports = { 
    sanitizeInput, 
    validateSchema,
    schemas: {
        grantApplication: grantApplicationSchema,
        statusUpdate: statusUpdateSchema
    }
};