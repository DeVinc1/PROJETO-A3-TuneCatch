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


/** 
 * @Route   GET /track/playlist-musicas/:id_playlist
 * @Desc    Obtém as músicas de uma playlist.
 */
router.get('/track/playlist-musicas/:id_playlist', trackController.getPlaylistTracks);

/**
 * @Route   DELETE /track/:id_playlist/:id_musica
 * @Desc    Remove uma música de uma playlist.
 */
router.delete('/track/:id_playlist/:id_musica', trackController.removeTrack);

module.exports = router;
