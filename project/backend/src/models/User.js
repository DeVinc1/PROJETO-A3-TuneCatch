const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}
User.init({
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
    unique: true,
    field: 'user_id',
    validate: {
      notEmpty: true,
      len: [1, 10],
      is: /^u-\d{4}$/
    },
},
username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'username',
    validate: {
      notEmpty: true,
      len: [3, 50],
    },
},
displayName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'display_name',
    validate: {
      len: [0, 50],
    },
},
email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'email',
    validate: {
      isEmail: true,
      notEmpty: true,
    },
},
passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash',
    validate: {
      notEmpty: true,
      len: [60, 255], 
    },
},
avatarURL: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'avatar_url',
    validate: {
      isUrl: true,
      len: [0, 255],
    },
    defaultValue: "example.com/avatar.png", //TODO: Must be replaced with a valid URL
},
isBanned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_banned',
},
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  hooks: {
     beforeValidate: (user) => {
        if (!user.id) {
          const randomID = Math.floor(1000 + Math.random() * 9000);
          user.id = `u-${randomID}`;
        }
      },
      beforeCreate: (user) => {
        if (!user.displayName) {
          user.displayName = user.username; 
        }
      },
      beforeUpdate: (user) => {
        if (!user.displayName) {
          user.displayName = user.username; 
        }
      },
  },
});

module.exports = User;


    