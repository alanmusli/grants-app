const mongoose = require('mongoose');

// Embedded Schema for the Conference details
const conferenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    destinationCountry: { type: String, required: true },
    travelDate: { type: Date, required: true },
    website: { type: String }
}, { _id: false });

// Embedded Schema for the Scientific Paper (Trud)
const paperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    authors: { type: String, required: true },
    abstract: { type: String }
}, { _id: false });

// Embedded Schema for Encrypted Documents
const documentSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    encryptedData: { 
        iv: { type: String, required: true },
        content: { type: String, required: true } 
    } // Storing the AES-256 encrypted buffers as hex strings
});

const applicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conference: {
        type: conferenceSchema,
        required: true
    },
    paper: {
        type: paperSchema,
        required: true
    },
    estimatedCosts: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['во разгледување', 'одобрено', 'одбиено', 'во дополнување'],
        default: 'во разгледување'
    },
    // Enforcing the 500 character limit for Dean's Office decisions
    statusJustification: {
        type: String,
        maxlength: [500, 'Justification cannot exceed 500 characters']
    },
    documents: [documentSchema],
    
    // Financial Tracking
    approvedGrantAmount: {
        type: Number,
        default: 0
    },
    advancePaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);