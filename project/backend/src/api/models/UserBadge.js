const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserBadge = sequelize.define('UserBadge', {
        isVisibleOnProfile: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_visible_on_profile',
        },
    }, {
        tableName: 'user_badge',
        timestamps: true,
        createdAt: 'granted_at',
        updatedAt: false, 
    });
    return UserBadge;
}