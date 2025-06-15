    const { Playlist, Track, PlaylistTrack, User, sequelize } = require('../models');

const findOrCreateTrack = async (trackData) => {
  const [track] = await Track.findOrCreate({
    where: { spotifyID: trackData.spotifyID },
    defaults: trackData,
  });
  return track;
};


const findPlaylistWithTracks = async (playlistId) => {
    const playlist = await Playlist.findByPk(playlistId, {
        include: {
            model: Track,
            as: 'tracks', 
            through: {
                attributes: ['position']
            }
        },
        order: [
             [{ model: Track, as: 'tracks' }, PlaylistTrack, 'position', 'ASC']
        ]
    });
    return playlist;
};

const findTrackById = async (trackId) => {
    return Track.findByPk(trackId);
};

const getPlaylistCountForTrack = async (trackInstance) => {
    return trackInstance.countPlaylists();
};

const deleteTrackById = async (trackId) => {
    await Track.destroy({ where: { id: trackId } });
};

const findPlaylistsByExactTrackName = async (trackName) => {
    const normalizedTrackName = trackName.replace(/\s/g, '').toLowerCase();

    const tracks = await Track.findAll({
        where: sequelize.where(
            sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('track_name'), ' ', '')),
            normalizedTrackName
        ),
        include: {
            model: Playlist,
            as: 'playlists',
            include: { 
                model: User,
                as: 'creator',
                attributes: ['id', 'username']
            },
            through: { attributes: [] }
        }
    });


    const allPlaylists = tracks.reduce((acc, track) => {
        if (track.playlists) {
            acc.push(...track.playlists);
        }
        return acc;
    }, []);
    
    const uniquePlaylists = Array.from(new Map(allPlaylists.map(p => [p.id, p])).values());

    return uniquePlaylists;
};

module.exports = {
  findOrCreateTrack,
  findPlaylistWithTracks,
  findTrackById,
  getPlaylistCountForTrack,
  deleteTrackById,
  findPlaylistsByExactTrackName
};