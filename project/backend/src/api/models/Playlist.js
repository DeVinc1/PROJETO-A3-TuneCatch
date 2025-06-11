const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Playlist = sequelize.define('Playlist', {
        id: {
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
            fieldname: 'name',
        },
        creatorId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            fieldname: 'creator_id',
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true,
            fieldname: 'description',
            defaultValue: '',
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            fieldname: 'is_visible',
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            fieldname: 'likes',
        },
        coverImageURL: {
            type: DataTypes.STRING,
            allowNull: true,
            fieldname: 'cover_image_url',
            validate: {
                isUrl: true,
            },
            defaultValue: 'https://example.com/default-cover.png', //TODO - Mudar para URL da imagem de capa padrão válida
        },
    }, {
        tableName: 'playlists',
        timestamps: true,
        createdAt: 'date_created',
        updatedAt: 'date_updated',
    });

    return Playlist;
}