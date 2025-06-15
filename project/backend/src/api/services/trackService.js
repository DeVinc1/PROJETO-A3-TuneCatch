const spotifyClient = require('../spotify-integration/spotifyClient');
const trackRepository = require('../repositories/trackRepository');
const playlistRepository = require('../repositories/playlistRepository'); 
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


const addTrackToPlaylist = async (spotifyTrackId, playlistId) => {
  const trackDetails = await spotifyClient.getTrackDetails(spotifyTrackId);
  if (!trackDetails) {
    throw new AppError('Música não encontrada no Spotify.', 404);
  }

  const playlist = await playlistRepository.findPlaylistById(playlistId);
  if (!playlist) {
    throw new AppError('Playlist não encontrada no nosso sistema.', 404);
  }

  const track = await trackRepository.findOrCreateTrack(trackDetails);

  await playlist.addTracks(track);

  return { message: `A música '${track.trackName}' foi adicionada à playlist '${playlist.name}' com sucesso!` };
};

const getTracksForPlaylist = async (playlistId) => {
    const playlist = await trackRepository.findPlaylistWithTracks(playlistId);

    if (!playlist) {
        throw new AppError('Playlist não encontrada.', 404);
    }

    return playlist.tracks || []; 
};


module.exports = {
  searchTracksByName,
  addTrackToPlaylist,
  getTracksForPlaylist
};

