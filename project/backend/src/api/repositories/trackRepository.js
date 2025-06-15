    const { Playlist, Track, PlaylistTrack } = require('../models');

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

module.exports = {
  findOrCreateTrack,
  findPlaylistWithTracks,
  findTrackById,
  getPlaylistCountForTrack,
  deleteTrackById
};