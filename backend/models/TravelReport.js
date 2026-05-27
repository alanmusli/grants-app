const mongoose = require('mongoose');

const travelReportSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
        unique: true // One report per application
    },
    submitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The single, mandatory PDF containing all receipts and proof
    reportDocument: {
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        encryptedData: { 
            iv: { type: String, required: true },
            content: { type: String, required: true } 
        }
    },
    refundProcessed: {
        type: Boolean,
        default: false
    },
    refundAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('TravelReport', travelReportSchema);