const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Tags = sequelize.define('Tags', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            fieldname: 'id',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            fieldname: 'name',
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            fieldname: 'category',
        },
        iconEmoji: {
            type: DataTypes.STRING,
            allowNull: false,
            fieldname: 'icon_emoji',
            defaultValue: '🎵', // Emoji padrão para as tags
        },
    },{
        tableName: 'tags',
        timestamps: false,
    });
    
     return Tags;
};