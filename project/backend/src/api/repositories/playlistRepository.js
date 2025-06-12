const { Playlist, User } = require('../models');
const { Op } = require('sequelize');

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

const findAllPlaylists = async () => {
  return Playlist.findAll({
    include: {
      model: User,
      as: 'creator',
      attributes: ['id', 'username']
    },
    order: [['date_created', 'DESC']] // Ordena pelas mais recentes
  });
};

const findPublicPlaylistsByName = async (nameQuery) => {
  return Playlist.findAll({
    where: {
      isVisible: true,
      name: {
        [Op.iLike]: `%${nameQuery}%` 
      }
    },
    include: {
      model: User,
      as: 'creator',
      attributes: ['id', 'username', 'displayName']
    },
    order: [['likes', 'DESC']] 
  });
};

module.exports = {
  createPlaylist,
  findPlaylistById,
  deletePlaylistById,
  findAllPlaylists,
  findPublicPlaylistsByName
};
