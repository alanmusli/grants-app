const mongoose = require('mongoose');

const grantSchema = new mongoose.Schema({
    // Links directly to the approved Application
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
        unique: true 
    },
    // Matches: odobren_iznos
    approvedAmount: {
        type: Number,
        required: true,
        min: 0 
    },
    // Matches: datum_na_isplata
    paymentDate: {
        type: Date 
    },
    // Matches: status_na_isplata
    paymentStatus: {
        type: String,
        enum: ['чека исплата', 'исплатено авансно', 'целосно исплатено', 'рефундирано'],
        default: 'чека исплата',
        required: true
    },
    // Tracks which user from the Finance Department processed this grant
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Grant', grantSchema);