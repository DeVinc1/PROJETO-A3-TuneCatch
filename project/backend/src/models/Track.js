const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Track = sequelize.define('Track', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            fieldname: 'id',
        },
        spotifyID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            fieldname: 'spotify_id',
        },
        trackName: {
            type: DataTypes.STRING,
            allowNull: false,
            fieldname: 'track_name',
        },
        artistName: {
            type: DataTypes.STRING,
            allowNull: false,
            fieldname: 'artist_name',
        },
        albumName: {
            type: DataTypes.STRING,
            allowNull: false,
            fieldname: 'album_name',
        },
        albumCoverURL: {
            type: DataTypes.STRING,
            allowNull: true,
            fieldname: 'album_cover_url',
            validate: {
                isUrl: true,
            },
        },
        durationMs: {
            type: DataTypes.INTEGER,
            allowNull: false,
            fieldname: 'duration_ms',
        },
    }, {
        tableName: 'tracks',
        timestamps: false,
    });

    return Track;
};