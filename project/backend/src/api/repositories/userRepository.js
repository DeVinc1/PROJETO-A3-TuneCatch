const { User, sequelize } = require('../models');
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


module.exports = {
    createUser,
    findOneByEmail,
    findOneByUsername
};