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


module.exports = {
    createUser,
    findOneByEmail,
    findOneByUsername,
    findUserById,
    findUserByUsername
};