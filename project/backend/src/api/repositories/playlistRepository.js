const { Playlist, User } = require('../models');

const createPlaylist = async (playlistData) => {
  const playlist = await Playlist.create(playlistData);

  return Playlist.findByPk(playlist.id, {
    include: {
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
    }
  });
};

const findPlaylistById = async (playlistId) => {
    return Playlist.findByPk(playlistId, {
        include: {
            model: User,
            as: 'creator',
            attributes: ['id', 'username']
        }
    });
};

const deletePlaylistById = async (playlistId) => {
  const deletedRowCount = await Playlist.destroy({
    where: { id: playlistId },
  });
  return deletedRowCount;
};


module.exports = {
  createPlaylist,
  findPlaylistById,
  deletePlaylistById
};
