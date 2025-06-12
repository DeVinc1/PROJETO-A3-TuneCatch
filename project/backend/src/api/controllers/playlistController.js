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

module.exports = {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getAllPlaylists
};