const RefreshToken = require('../models/RefreshToken');

const createRefreshToken = async (tokenData) => {
    return await RefreshToken.create(tokenData);
};

const findRefreshTokenByToken = async (token) => {
    return await RefreshToken.findOne({ token });
};

const deleteRefreshToken = async (token) => {
    return await RefreshToken.deleteOne({ token });
};

const deleteUserRefreshTokens = async (userId) => {

    return await RefreshToken.deleteMany({
        userId
    });

};

module.exports = {
    createRefreshToken,
    findRefreshTokenByToken,
    deleteRefreshToken,
    deleteUserRefreshTokens
};