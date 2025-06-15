const express = require('express');
const trackController = require('../controllers/trackController');

const router = express.Router();

/**
 * @Route   GET /pesquisa/:nome
 * @Desc    Pesquisa por músicas na API do Spotify.
 */
router.get('/track/pesquisa/:nome', trackController.search);

module.exports = router;
