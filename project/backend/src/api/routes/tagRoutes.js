const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

/**
 * @route   POST maestro/tag
 * @desc    Cria uma nova tag.
 */
router.post('/tag', tagController.createTag);

module.exports = router;
