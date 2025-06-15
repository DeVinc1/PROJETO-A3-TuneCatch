const trackService = require('../services/trackService');

const search = async (req, res, next) => {
  try {
    const { nome } = req.params;
    const tracks = await trackService.searchTracksByName(nome);
    res.status(200).json({ tracks });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
};