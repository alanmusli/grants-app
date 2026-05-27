const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    casUsername: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Научник', 'Деканат', 'Финансии', 'Кадрово', 'Администратор'],
        default: 'Научник',
        required: true
    },
    // Tracks the utilized amount of the 100,000 MKD annual budget
    utilizedBudget: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);