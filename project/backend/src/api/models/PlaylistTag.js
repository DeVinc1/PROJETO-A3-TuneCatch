const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PlaylistTag = sequelize.Define('PlaylistTag', {
    }, {
        tableName: 'playlist_tags',
        timestamps: false,
    });

    return PlaylistTag;
}