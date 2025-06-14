const { get, search } = require('../routes/tagRoutes');
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

const searchTags = async (req, res, next) => {
    try {
        const { name } = req.params;
        const tags = await tagService.searchTags(name);
        res.status(200).json({ tags });
    } catch (error) {
        next(error);
    }
};

const getTagById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tag = await tagService.getTagById(id);
        res.status(200).json(tag);
    } catch (error) {
        next(error);
    }
};

const updateTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedTag = await tagService.updateTag(id, req.body);
        res.status(200).json({
            message: 'Tag atualizada com sucesso!',
            tag: updatedTag
        });
    } catch (error) {
        next(error);
    }
};

const deleteTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        await tagService.deleteTag(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
  createTag,
  getAllTags,
  searchTags,
  getTagById,
  updateTag,
  deleteTag
};
