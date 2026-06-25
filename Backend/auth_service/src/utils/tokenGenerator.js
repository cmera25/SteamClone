const User = require('../models/User');

const createUser = async (userData) => {
    return await User.create(userData);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const findUserById = async (userId) => {
    return await User.findById(userId);
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};