const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    expiresAt: {
        type: Date,
        required: true,
        expires: 0
    }
    }
);

module.exports = mongoose.model(
    'PasswordResetToken',
    passwordResetTokenSchema
);