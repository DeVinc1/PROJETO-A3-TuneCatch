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
            : 'https://example.com/default-avatar.png', // TODO: Mudar para um link de avatar padrão real
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

const getUsersByDisplayName = async (displayNameQuery) => {
    if(!displayNameQuery || typeof displayNameQuery !== 'string' || displayNameQuery.trim() === '') {
        return [];
    }
    const users = await userRepository.findUsersByDisplayName(displayNameQuery);
    return users;
}

const utils_validateUserPassword = async (userID, currentPassword) => {
  if (!currentPassword) {
    throw new AppError('A senha atual é obrigatória para realizar esta operação.', 400);
  }
  const user = await userRepository.findUserAllInfo(userID);

  if (!user) {
    throw new AppError('Usuário não encontrado.', 404);
  }
  const isMatch = await verifyPassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new AppError('A senha atual está incorreta.', 403);
  }
  return user;
};

const updateProfileDetails = async (userID, profileData) => {
  const { currentPassword, username, email, displayName, avatarURL } = profileData;
  const user = await utils_validateUserPassword(userID, currentPassword);

  if (username && username !== user.username) {
    if (await userRepository.findOneByUsername(username)) {
      throw new AppError('Nome de usuário já está em uso.', 409, 'username');
    }
    user.username = username;
  }
  
  
  if (email && email !== user.email) {
    if (await userRepository.findOneByEmail(email)) {
      throw new AppError('Email já está em uso.', 409, 'email');
    }
    user.email = email;
  }
  
  if (displayName) user.displayName = displayName;
  if (avatarURL) user.avatarURL = avatarURL;
  
  await user.save();

  return userRepository.findUserById(userID);
};

const changePassword = async (userID, passwordData) => {
  const { currentPassword, newPassword } = passwordData;
  if (!newPassword) {
    throw new AppError('A nova senha é obrigatória.', 400);
  }

  const user = await utils_validateUserPassword(userID, currentPassword);
  
  user.passwordHash = await hashPassword(newPassword);
  await user.save();
};

const toggleFollowUser = async (followerId, followedId) => {
  if (followerId == followedId) {
    throw new AppError('Não é possível seguir a si mesmo!', 403);
  }

  const followerUser = await userRepository.findUserWithFollowing(followerId);
  const userToFollow = await userRepository.findUserById(followedId);

  if (!followerUser || !userToFollow) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  const isAlreadyFollowing = followerUser.following.some(
    (followedUser) => followedUser.id == followedId
  );


  if (isAlreadyFollowing) {
    await followerUser.removeFollowing(userToFollow);
  } else {
    await followerUser.addFollowing(userToFollow);
  }

  const updatedFollower = await userRepository.findUserWithFollowing(followerId);

  return {
    id: updatedFollower.id,
    username: updatedFollower.username,
    following: updatedFollower.following.map(user => ({ id: user.id, username: user.username })),
  };
};

const banUser = async (adminId, userIdToBan) => {
  const adminUser = await userRepository.findUserById(adminId);
  if (!adminUser || !adminUser.isAdmin) {
    throw new AppError('Somente administradores podem banir um usuário!', 401);
  }

  const userToBan = await userRepository.findUserAllInfo(userIdToBan);
  if (!userToBan) {
    throw new AppError('A conta a ser banida não existe.', 404);
  }

  if (userToBan.isBanned) {
    throw new AppError('Essa conta já foi banida.', 409);
  }

   userToBan.isBanned = true;
  await userToBan.save();

  return {
    id: userToBan.id,
    username: userToBan.username,
  };
};

module.exports = {
    registerNewUser,
    loginUser,
    getUserDetails,
    getUserDetailsByUsername,
    getUsersByDisplayName,
    updateProfileDetails,
    changePassword,
    toggleFollowUser,
    banUser,
};