const express = require('express');
const playlistController = require('../controllers/playlistController');

const router = express.Router();

/**
 * @Route   GET /playlist
 * @Desc    Busca todas as playlists do sistema.
 */
router.get('/playlist', playlistController.getAllPlaylists);

/**
 * @Route   GET /publica/:nome
 * @Desc    Busca playlists públicas por nome.
 */
router.get('/playlist/publica/:nome', playlistController.searchPublicPlaylists);

/**
 * @Route   GET /playlist/:id_playlist
 * @Desc    Busca uma playlist específica pelo seu ID.
 */
router.get('/playlist/:id_playlist', playlistController.getPlaylistById);

/**
 * @Route   POST /playlist/:id_usuario
 * @Desc    Cria uma nova playlist para um utilizador.
 */
router.post('/playlist/:id_usuario', playlistController.createPlaylist);

/**
 * @Route   PUT /playlist/:id_playlist
 * @Desc    Atualiza uma playlist existente.
 */
router.put('/playlist/:id_playlist', playlistController.updatePlaylist);

/**
 * @Route   DELETE /playlist/:id_playlist
 * @Desc    Exclui uma playlist existente.
 */
router.delete('/playlist/:id_playlist', playlistController.deletePlaylist);


module.exports = router;