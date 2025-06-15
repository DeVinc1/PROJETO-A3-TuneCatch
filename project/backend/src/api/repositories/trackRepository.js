const { Track } = require('../models');

const findOrCreateTrack = async (trackData) => {
  const [track] = await Track.findOrCreate({
    where: { spotifyID: trackData.spotifyID },
    defaults: trackData,
  });
  return track;
};

module.exports = {
  findOrCreateTrack,
};