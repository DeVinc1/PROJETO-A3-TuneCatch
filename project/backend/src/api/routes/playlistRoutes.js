const express = require('express');
const playlistController = require('../controllers/playlistController');

const router = express.Router();

/**
 * @Route   GET maestro/playlist
 * @Desc    Busca todas as playlists do sistema.
 */
router.get('/playlist', playlistController.getAllPlaylists);

/**
 * @Route   GET maestro/playlist/publica/:nome
 * @Desc    Busca playlists públicas por nome.
 */
router.get('/playlist/publica/:nome', playlistController.searchPublicPlaylists);

/**
 * @Route   GET maestro/playlist/usuario-publicas/:id_usuario
 * @Desc    Busca todas as playlists de um usuário.
 */

router.get('/playlist/usuario-publicas/:id_usuario', playlistController.getPublicPlaylistsByCreator);

/**
 * @Route   GET maestro/playlist/usuario/:id_usuario
 * @Desc    Busca todas as playlists de um usuário.
 */
router.get('/playlist/usuario/:id_usuario', playlistController.getPlaylistsByCreator);

/**
 * @Route   GET maestro/playlist/:id_playlist
 * @Desc    Busca uma playlist específica pelo seu ID.
 */
router.get('/playlist/:id_playlist', playlistController.getPlaylistById);

/**
 * @Route   GET maestro/playlist/curtidas/:id_usuario
 * @Desc    Busca todas as playlists curtidas de um usuãrio.
 */
router.get('/playlist/curtidas/:id_usuario', playlistController.getLikedPlaylists); 

/**
 * @Route   POST maestro/playlist/curtir/visibilidade/:id_usuario
 * @Desc    Permite alterar o estado de visibilidade de uma curtida em uma playlist.
 */
router.post('/playlist/curtir/alterar-visibilidade/:id_usuario', playlistController.setLikeVisibility);

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

/**
 * @Route   POST maestro/playlist/curtir/:id_usuario
 * @Desc    Permite que um usuário curta ou descurta uma playlist.
 */
router.post('/playlist/curtir/:id_usuario', playlistController.toggleLike);

module.exports = router;