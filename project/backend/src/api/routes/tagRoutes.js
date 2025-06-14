const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

/**
 * @Route   GET maestro/tag
 * @Desc    Busca todas as tags do sistema.
 */
router.get('/tag', tagController.getAllTags);

/**
 * @Route   GET maestro/tag/:id
 * @Desc    Busca as tags do sistema pelo ID.
 */
router.get('/tag/:id', tagController.getTagById);

/**
 * @Route   GET maestro/tag/nome/:name
 * @Desc    Busca tags do sistema pelo seu nome.
 */
router.get('/tag/nome/:name', tagController.searchTags);

/**
 * @Route   POST maestro/tag
 * @Desc    Cria uma nova tag.
 */
router.post('/tag', tagController.createTag);

/**
 * @Route   PUT maestro/tag/:id
 * @Desc    Atualiza uma tag existente.
 */
router.put('/tag/:id', tagController.updateTag);

/**
 * @Route   DELETE maestro/tag/:id
 * @Desc    Deleta uma tag existente.
 */
router.delete('/tag/:id', tagController.deleteTag);

module.exports = router;
