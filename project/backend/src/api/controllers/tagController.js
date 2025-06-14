const { get } = require('../routes/tagRoutes');
const tagService = require('../services/tagService');

const createTag = async (req, res, next) => {
  try {
    const tagDetails = req.body;
    const newTag = await tagService.createNewTag(tagDetails);

    res.status(201).json({
      message: 'Tag criada com sucesso!',
      tag: newTag,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTags = async (req, res, next) => {
    try {
        const tags = await tagService.getAllTags();
        res.status(200).json({ tags });
    } catch (error) {
        next(error);
    }
};

module.exports = {
  createTag,
  getAllTags
};
