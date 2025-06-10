const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserPlaylistLiked = sequelize.define('UserPlaylistLiked', {

        likeVisibleOnProfile: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            fieldname: 'like_visible_on_profile',
        },
    },{
        tableName: 'user_playlist_liked',
        timestamps: true,
        createdAt: 'liked_at',
    });

    return UserPlaylistLiked;
}