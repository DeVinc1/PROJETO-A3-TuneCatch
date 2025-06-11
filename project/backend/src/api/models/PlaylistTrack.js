const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PlaylistTrack = sequelize.define('PlaylistTrack', {
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
            fieldname: 'position',
        },
    }, {
        tableName: 'playlist_tracks',
        timestamps: false,
    });

    return PlaylistTrack;
}