const { Tags } = require('../models');
const { get } = require('../routes/tagRoutes');

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

module.exports = {
  createTag,
  findTagByName,
  findAllTags,

};
