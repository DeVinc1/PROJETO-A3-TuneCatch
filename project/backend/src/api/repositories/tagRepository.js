const { Tags } = require('../models');

const createTag = async (tagData) => {
  const tag = await Tags.create(tagData);
  return tag;
};

const findTagByName = async (name) => {
  const tag = await Tags.findOne({ where: { name } });
  return tag;
};

module.exports = {
  createTag,
  findTagByName,
};
