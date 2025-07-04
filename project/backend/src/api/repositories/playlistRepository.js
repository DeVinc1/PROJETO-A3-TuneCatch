const { Playlist, User, UserPlaylistLiked } = require('../models');
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
    order: [['date_created', 'DESC']] 
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

const findAllByCreatorId = async (userId) => {
    return Playlist.findAll({
        where: {
            creatorId: userId
        },
        include: {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'displayName']
        },
        order: [['date_created', 'DESC']]
    });
};

const findPublicPlaylistsByCreatorId = async (userId) => {
    return Playlist.findAll({
        where: {
            creatorId: userId,
            isVisible: true
        },
        include: {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'displayName']
        },
        order: [['date_created', 'DESC']]
    });
};

const updateUserPlaylistLikeVisibility = async (userId, playlistId, isVisible) => {
    const [affectedRows] = await UserPlaylistLiked.update(
        { likeVisibleOnProfile: isVisible },
        {
            where: {
                user_id: userId,
                playlist_id: playlistId,
            },
        }
    );
    return affectedRows;
};

const findLikedPlaylistsByUserId = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username'], 
   
    include: {
      model: Playlist,
      as: 'likedPlaylists',
      
      include: {
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      },

      through: {
        attributes: ['likeVisibleOnProfile', 'liked_at']
      }
    }
  });
  return user;
};

module.exports = {
  createPlaylist,
  findPlaylistById,
  deletePlaylistById,
  findAllPlaylists,
  findPublicPlaylistsByName,
  findAllByCreatorId,
  findPublicPlaylistsByCreatorId,
  updateUserPlaylistLikeVisibility,
  findLikedPlaylistsByUserId
};
