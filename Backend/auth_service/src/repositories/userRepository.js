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

const deleteUserById = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

const updateUserPassword = async (
    userId,
    password
) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            password
        },
        {
            new: true
        }
    );

};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    deleteUserById,
    updateUserPassword
};