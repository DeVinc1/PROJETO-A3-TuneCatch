const express = require('express');
const trackController = require('../controllers/trackController');

const router = express.Router();

/**
 * @Route   GET /pesquisa/:nome
 * @Desc    Pesquisa por músicas na API do Spotify.
 */
router.get('/track/pesquisa/:nome', trackController.search);
/**
 * @Route   POST /track/adicionar/:id_track
 * @Desc    Adiciona uma música a uma playlist.
 */
router.post('/track/adicionar/:id_track', trackController.addTrack);

module.exports = router;
