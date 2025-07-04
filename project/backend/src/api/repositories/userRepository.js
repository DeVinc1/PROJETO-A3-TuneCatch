const { User, Playlist, Badges, sequelize } = require('../models');
const { Op } = require('sequelize');

const createUser = async (userData) => {
    const user = await User.create(userData);
    return user; 
};

const findOneByEmail = async (email) => {
    const user = await User.findOne({ where: { email } });
    return user;
};

const findOneByUsername = async (username) => {
    const user = await User.findOne({ where: { username } });
    return user;
};

const findOneByCredentials = async (credential) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { email: credential },
        { username: credential }
      ]
    }
  });
  return user;
};

const findUserById = async (id) => {
    const user = await User.findByPk(id, {
        attributes: {
            exclude: ['passwordHash']
        },
        include: [
            {
                model: Playlist,
                as: 'createdPlaylists',
            },
            {
                model: Playlist,
                as: 'likedPlaylists',
                through: {
                    attributes: []
                }
            },
            {
                model: User,
                as: 'following',
                attributes: ['id', 'username', 'displayName', 'avatarURL'],
                through: {
                    attributes: []
                }
            },
            {
                model: User,
                as: 'followers',
                attributes: ['id', 'username', 'displayName', 'avatarURL'],
                through: {
                    attributes: []
                }
            },
            {
                model: Badges,
                as: 'userBadges',
                through: {
                    attributes: []
                }
            }
        ]
    });
    return user;
};

const findUserByUsername = async (username) => {
    const user = await User.findOne({
        where: { username },
        attributes: {
            exclude: ['passwordHash']
        },
    })
    return user;
};

const findUsersByDisplayName = async (displayName) => {
    const user = await User.findAll({
        where: { displayName },
        attributes:['id', 'username', 'displayName', 'avatarURL'],
    });
    return user;
};

const findUserAllInfo = async (id) => {
    const user = await User.findByPk(id);
    return user;
}

const findUserWithFollowing = async (userId) => {
  const user = await User.findByPk(userId, {
    include: {
      model: User,
      as: 'following',
      attributes: ['id', 'username'],
    },
  });
  return user;
};

const deleteUserById = async (userId) => {
  const deletedRowCount = await User.destroy({
    where: { id: userId },
  });
  return deletedRowCount;
};

const findAllUsers = async () => {
    return User.findAll({
        attributes: {
            exclude: ['passwordHash', 'email', 'isAdmin', 'isBanned', 'date_updated']
        },
        order: [['date_created', 'ASC']]
    });
};

module.exports = {
    createUser,
    findOneByEmail,
    findOneByUsername,
    findOneByCredentials,
    findUserById,
    findUserByUsername,
    findUsersByDisplayName,
    findUserAllInfo,
    findUserWithFollowing,
    deleteUserById,
    findAllUsers
}