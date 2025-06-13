const { get } = require('../routes/playlistRoutes');
const playlistService = require('../services/playlistService');

const createPlaylist = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;
    const { name, description, isVisible, coverImageURL } = req.body;

    const newPlaylist = await playlistService.createNewPlaylist(id_usuario, {
        name,
        description,
        isVisible,
        coverImageURL
    });

    res.status(201).json({
      message: 'Playlist criada com sucesso!',
      playlist: newPlaylist,
    });
  } catch (error) {
    next(error);
  }
};

const updatePlaylist = async (req, res, next) => {
    try {
        const { id_playlist } = req.params;
        const { name, description, isVisible, coverImageURL } = req.body;
        
        const updatedPlaylist = await playlistService.updatePlaylistDetails(id_playlist, {
        name,
        description,
        isVisible,
        coverImageURL
    });
        res.status(200).json({
            message: 'Playlist atualizada com sucesso!',
            playlist: updatedPlaylist,
        });
    } catch (error) {
        next(error);
    }
};

const deletePlaylist = async (req, res, next) => {
  try {
    const { id_playlist } = req.params;
    await playlistService.deletePlaylist(id_playlist);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await playlistService.getAllPlaylists();
    res.status(200).json({ playlists });
  } catch (error) {
    next(error);
  }
};

const getPlaylistById = async (req, res, next) => {
  try {
    const { id_playlist } = req.params;
    const playlist = await playlistService.getPlaylistById(id_playlist);
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

const searchPublicPlaylists = async (req, res, next) => {
    try {
        const { nome } = req.params;
        const playlists = await playlistService.searchPublicPlaylists(nome);
        res.status(200).json({ playlists });
    } catch (error) {
        next(error);
    }
};

const getPlaylistsByCreator = async (req, res, next) => {
    try {
        const { id_usuario } = req.params;
        const playlists = await playlistService.getPlaylistsByCreator(id_usuario);
        res.status(200).json({ playlists });
    } catch (error) {
        next(error);
    }
};

const getPublicPlaylistsByCreator = async (req, res, next) => {
    try {
        const { id_usuario } = req.params;
        const playlists = await playlistService.getPublicPlaylistsByCreator(id_usuario);
        res.status(200).json({ playlists });
    } catch (error) {
        next(error);
    }
};

const toggleLike = async (req, res, next) => {
    try {
        const { id_usuario } = req.params;
        const { playlistId } = req.body;

        if (!playlistId) {
            throw new AppError('O ID da playlist é obrigatório.', 400);
        }

        const result = await playlistService.togglePlaylistLike(id_usuario, playlistId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const setLikeVisibility = async (req, res, next) => {
    try {
        const { id_usuario } = req.params;
        const { playlistId, isVisible } = req.body;

        if (!playlistId) {
            throw new AppError('O ID da playlist é obrigatório.', 400);
        }

        await playlistService.setLikeVisibility(id_usuario, playlistId, isVisible);
        res.status(200).json({ message: 'Visibilidade da curtida atualizada com sucesso!' });
    } catch (error) {
        next(error);
    }
};


module.exports = {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
  searchPublicPlaylists,
  getPlaylistsByCreator,
  getPublicPlaylistsByCreator,
  toggleLike,
  setLikeVisibility
};