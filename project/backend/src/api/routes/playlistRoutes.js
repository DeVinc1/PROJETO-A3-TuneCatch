const express = require('express');
const playlistController = require('../controllers/playlistController');

const router = express.Router();


/**
 * @route   GET maestro/playlist/
 * @desc    Busca todas as playlists do sistema.
 */
router.get('/playlist', playlistController.getAllPlaylists);


/**
 * @Route   POST maestro/playlist/:id_usuario
 * @Desc    Cria uma nova playlist para um utilizador.
 */
router.post('/playlist/:id_usuario', playlistController.createPlaylist);


/**
 * @Route   PUT maestro/playlist/:id_playlist
 * @Desc    Atualiza uma playlist existente.
 */
router.put('/playlist/:id_playlist', playlistController.updatePlaylist);

/**
 * @Route   DELETE maestro/playlist/:id_playlist
 * @Desc    Exclui uma playlist existente.
 */
router.delete('/playlist/:id_playlist', playlistController.deletePlaylist);

module.exports = router;