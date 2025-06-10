const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserFollow = sequelize.define('UserFollow', {
    },
    {
        tableName: 'user_follow',
        timestamps: false,
    });

    return UserFollow;
}