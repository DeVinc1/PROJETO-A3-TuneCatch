const playlistRepository = require('../repositories/playlistRepository');
const userRepository = require('../repositories/userRepository');
const { AppError } = require('../../utils/errorUtils');
const { get } = require('../routes/playlistRoutes');

const createNewPlaylist = async (creatorId, playlistDetails) => {
  const { name, description, isVisible, coverImageURL } = playlistDetails;

  const creator = await userRepository.findUserById(creatorId);
  if (!creator) {
    throw new AppError('Utilizador criador não encontrado.', 404);
  }

  if (!name) {
    throw new AppError('O nome da playlist é obrigatório.', 400);
  }

  const playlistData = {
    creatorId,
    name,
    description,
    isVisible,
    coverImageURL: coverImageURL && coverImageURL.trim() !== ''
        ? coverImageURL
        : 'https://example.com/default-cover.png', // TODO: Mudar para URL da imagem de capa padrão válida
  };

  const newPlaylist = await playlistRepository.createPlaylist(playlistData);
  return newPlaylist;
};

const updatePlaylistDetails = async (playlistId, updateDetails) => {
    const playlist = await playlistRepository.findPlaylistById(playlistId);
    if (!playlist) {
        throw new AppError('Playlist não encontrada.', 404);
    }

    const { name, description, isVisible, coverImageURL } = updateDetails;
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isVisible !== undefined) playlist.isVisible = isVisible;
    if (coverImageURL) playlist.coverImageURL = coverImageURL;

    await playlist.save();
    return playlist;
};

const deletePlaylist = async (playlistId) => {
  const result = await playlistRepository.deletePlaylistById(playlistId);

  if (result === 0) {
    throw new AppError('Playlist não encontrada para exclusão.', 404);
  }
};

const getAllPlaylists = async () => {
  return await playlistRepository.findAllPlaylists();
};


const getPlaylistById = async (playlistId) => {
  const playlist = await playlistRepository.findPlaylistById(playlistId);
  if (!playlist) {
    throw new AppError('Playlist não encontrada.', 404);
  }
  return playlist;
};

const searchPublicPlaylists = async (searchQuery) => {
  if (!searchQuery) {
    return []; 
  }
  return await playlistRepository.findPublicPlaylistsByName(searchQuery);
};

const getPlaylistsByCreator = async (creatorId) => {
  const creator = await userRepository.findUserById(creatorId);
  if (!creator) {
      throw new AppError('Utilizador não encontrado.', 404);
  }

  return await playlistRepository.findAllByCreatorId(creatorId);
};

const getPublicPlaylistsByCreator = async (creatorId) => {
  const creator = await userRepository.findUserById(creatorId);
  if (!creator) {
      throw new AppError('Utilizador não encontrado.', 404);
  }

  return await playlistRepository.findPublicPlaylistsByCreatorId(creatorId);
};

const togglePlaylistLike = async (userId, playlistId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new AppError('Utilizador não encontrado.', 404);
    }

    const playlist = await playlistRepository.findPlaylistById(playlistId);
    if (!playlist) {
        throw new AppError('Playlist não encontrada.', 404);
    }

    if (playlist.creatorId == userId) {
        throw new AppError('Não é possível curtir a própria playlist.', 409);
    }

    const hasLiked = await user.hasLikedPlaylists(playlist);

    let message;

    if (hasLiked) {
        await user.removeLikedPlaylists(playlist);
        playlist.likes -= 1;
        message = 'Like removido com sucesso.';
    } else {
        await user.addLikedPlaylists(playlist);
        playlist.likes += 1;
        message = 'Playlist curtida com sucesso.';
    }

    await playlist.save();

    return {
        message,
        newLikeCount: playlist.likes,
    };
};


module.exports = {
  createNewPlaylist,
  updatePlaylistDetails,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
  searchPublicPlaylists,
  getPlaylistsByCreator,
  getPublicPlaylistsByCreator,
  togglePlaylistLike
};