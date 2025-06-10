const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../../utils/authUtils');
const { AppError } = require('../../utils/errorUtils');

const registerNewUser = async ({ username, email, password, displayName, avatarURL }) => {
    if (!username || !email || !password) {
        throw new AppError('Campos obrigatórios não podem estar vazios.', 400);
    }

    const existingUserByEmail = await userRepository.findOneByEmail(email);
    if (existingUserByEmail) {
        throw new AppError('O email já está em uso.', 409, 'email');
    }

    const existingUserByUsername = await userRepository.findOneByUsername(username);
    if (existingUserByUsername) {
        throw new AppError('O nome de usuário já está em uso.', 409, 'username');
    }

    const passwordHash = await hashPassword(password);

    const newUserData = {
        username,
        email,
        passwordHash: passwordHash,
        displayName: displayName,
        avatarURL: avatarURL && avatarURL.trim() !== ''
            ? avatarURL
            : 'https://example.com/default-avatar.png',
    };

    const newUser = await userRepository.createUser(newUserData);

    return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        dateCreated: newUser.date_created,
    };
};

module.exports = {
    registerNewUser,
};