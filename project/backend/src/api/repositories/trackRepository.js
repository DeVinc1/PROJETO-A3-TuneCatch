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


module.exports = {
  findOrCreateTrack,
  findPlaylistWithTracks
};