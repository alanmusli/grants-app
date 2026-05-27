const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
    // Using a single document pattern since there's only one active configuration
    configVersion: {
        type: Number,
        default: 1,
        unique: true
    },
    annualBudgetLimit: {
        type: Number,
        default: 100000 // Default 100,000 MKD
    },
    perDiemRates: {
        // Map of Country Codes/Names to their specific MKD daily rate
        type: Map,
        of: Number,
        default: {
            "MKD": 1500, // Domestic example
            "DEFAULT": 3000 // Foreign fallback
        }
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemConfig', systemConfigSchema);