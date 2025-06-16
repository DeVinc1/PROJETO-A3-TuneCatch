const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            fieldname: 'id',
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            fieldname: 'username',
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: true,
            fieldname: 'display_name',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
            fieldname: 'email',
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
            fieldname: 'password',
        },
        avatarURL: {
            type: DataTypes.STRING,
            allowNull: true,
            fieldname: 'avatar_url',
            validate: {
                isUrl: true,
            },
            defaultValue: '../../../../frontend/src/assets/placeholder-pfp.png', //TODO - Mudar para URL do avatar padrão válida
        },
        isBanned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            fieldname: 'is_banned',
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            fieldname: 'is_admin',
        },
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'date_created',
        updatedAt: 'date_updated',

        hooks: {
            beforeValidate: (user, options) => {
                if (user.displayName === null || user.displayName === undefined || user.displayName.trim() === '') {
                    user.displayName = user.username; // DisplayName vazio é definido para igual ao username
                }
            },
        }
    });

    return User;
}