const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

/**
 * @Route   GET maestro/tag
 * @Desc    Busca todas as tags do sistema.
 */
router.get('/tag', tagController.getAllTags);

/**
 * @Route   POST maestro/tag
 * @Desc    Cria uma nova tag.
 */
router.post('/tag', tagController.createTag);

module.exports = router;
