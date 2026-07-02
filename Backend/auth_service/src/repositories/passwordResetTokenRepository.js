const PasswordResetToken = require('../models/PasswordResetToken');

const createPasswordResetToken = async (tokenData) => {
    return await PasswordResetToken.create(tokenData);
};

const findPasswordResetTokenByToken = async (token) => {
    return await PasswordResetToken.findOne({
        token
    });
};

const deletePasswordResetToken = async (token) => {
    return await PasswordResetToken.deleteOne({
        token
    });
};

const deleteUserPasswordResetTokens = async (userId) => {
    return await PasswordResetToken.deleteMany({
        userId
    });
};

module.exports = {
    createPasswordResetToken,
    findPasswordResetTokenByToken,
    deletePasswordResetToken,
    deleteUserPasswordResetTokens
};