const { Tags, Playlist, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const createTag = async (tagData) => {
  const tag = await Tags.create(tagData);
  return tag;
};

const findTagByName = async (name) => {
  const tag = await Tags.findOne({ where: { name } });
  return tag;
};

const findAllTags = async () => {
    const tags = await Tags.findAll({
        order: [['category', 'ASC'], ['name', 'ASC']] 
    });
    return tags;
};

const searchTagsByName = async (nameQuery) => {
  return Tags.findAll({
    where: {
      name: {
        [Op.iLike]: `%${nameQuery}%` // iLike é case-insensitive, '%' busca por correspondência parcial
      }
    },
    order: [['name', 'ASC']]
  });
};

const findTagById = async (id) => {
    const tag = await Tags.findByPk(id);
    return tag;
};

const deleteTagById = async (tagId) => {
    const deletedRowCount = await Tags.destroy({
        where: { id: tagId },
    });
    return deletedRowCount;
};

const findPlaylistWithTags = async (playlistId) => {
    const playlist = await Playlist.findByPk(playlistId, {
        include: {
            model: Tags,
            as: 'tags' // O 'as' que definimos na associação
        }
    });
    return playlist;
};

const findPlaylistsByTagNames = async (tagNames) => {
    if (!tagNames || tagNames.length === 0) {
        return [];
    }

    const playlists = await Playlist.findAll({
        include: [
            {
                model: Tags,
                as: 'tags',
                where: {
                    name: {
                        [Op.in]: tagNames
                    }
                },
                attributes: [], 
                through: { attributes: [] }
            },
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'username', 'displayName']
            }
        ],
        group: ['Playlist.id', 'creator.id'],
        having: sequelize.literal(`COUNT(DISTINCT "tags"."id") = ${tagNames.length}`)
    });

    return playlists;
};

const findPlaylistTags = async (playlistId) => {
    const playlist = await Playlist.findByPk(playlistId, {
        include: {
            model: Tags,
            as: 'tags',
            through: { attributes: [] }
        }
    });
    return playlist;
};

module.exports = {
  createTag,
  findTagByName,
  findAllTags,
  searchTagsByName,
  findTagById,
  deleteTagById,
  findPlaylistWithTags,
  findPlaylistsByTagNames,
  findPlaylistTags
};

