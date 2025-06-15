const trackService = require('../services/trackService');
const { AppError } = require('../../utils/errorUtils');

const search = async (req, res, next) => {
  try {
    const { nome } = req.params;
    const tracks = await trackService.searchTracksByName(nome);
    res.status(200).json({ tracks });
  } catch (error) {
    next(error);
  }
};

const addTrack = async (req, res, next) => {
    try {
        const { id_track } = req.params; 
        const { playlistId } = req.body; 

        if (!playlistId) {
            throw new AppError('O ID da playlist é obrigatório no corpo da requisição.', 400);
        }

        const result = await trackService.addTrackToPlaylist(id_track, playlistId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

module.exports = {
  search,
  addTrack
};