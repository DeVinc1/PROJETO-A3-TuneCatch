const { Tags } = require('../models');
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

module.exports = {
  createTag,
  findTagByName,
  findAllTags,
  searchTagsByName,
  findTagById
};

