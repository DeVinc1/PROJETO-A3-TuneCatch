const userRepository = require('../repositories/userRepository');
const { hashPassword, verifyPassword } = require('../../utils/authUtils');
const { AppError } = require('../../utils/errorUtils');
const { get } = require('../routes/userRoutes');

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

const loginUser = async (credential, password) => {
    if (!credential || !password || typeof password !== 'string') {
        throw new AppError('As credenciais enviadas estão incompletas ou incorretas.', 401);
    }

    const user = await userRepository.findOneByCredentials(credential);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
        throw new AppError('As credenciais enviadas estão incompletas ou incorretas.', 401);
    }

    if (user.isBanned) {
        throw new AppError('Essa conta foi banida.', 403);
    }

    return {
        idUserLogged: user.id,
    }
};

const getUserDetails = async (userId) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
};

const getUserDetailsByUsername = async (username) => {
    const user = await userRepository.findUserByUsername(username);
    if (!user) {
        throw new AppError('Usuário não encontrado.', 404);
    }
    return user;
}


module.exports = {
    registerNewUser,
    loginUser,
    getUserDetails,
    getUserDetailsByUsername
};