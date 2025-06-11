const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PlaylistTag = sequelize.define('PlaylistTag', {
    }, {
        tableName: 'playlist_tags',
        timestamps: false,
    });

    return PlaylistTag;
}