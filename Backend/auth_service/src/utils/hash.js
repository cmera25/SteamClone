const crypto = require('crypto');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashToken = (token) => {

    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (
    plainPassword,
    hashedPassword
) => {
    return await bcrypt.compare(
    plainPassword,
    hashedPassword
    );
};

module.exports = {
    hashToken,
    hashPassword,
    comparePassword
};