
const spotifyClient = require('../spotify-integration/spotifyClient');
const { AppError } = require('../../utils/errorUtils');


const searchTracksByName = async (searchQuery) => {
  if (!searchQuery) {
    throw new AppError('Um termo de pesquisa é obrigatório.', 400);
  }

  try {
    const results = await spotifyClient.searchTracks(searchQuery);
    return results;
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

module.exports = {
  searchTracksByName,
};
