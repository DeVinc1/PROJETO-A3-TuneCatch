const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};


const getAccessToken = async () => {
  try {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials',
    });

    accessToken = response.data.access_token;
    console.log('Token de acesso do Spotify obtido com sucesso!');

  } catch (error) {
    console.error('Erro ao obter token de acesso do Spotify:', error.response ? error.response.data : error.message);
    throw new Error('Não foi possível autenticar com o Spotify.');
  }
};


const searchTracks = async (query) => {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 20, 
      },
    });

    const formattedTracks = response.data.tracks.items.map(item => {
        const largeImage = item.album.images.find(img => img.width === 640) || item.album.images[0];
        
        return {
            id: item.id,
            name: item.name,
            artists: item.artists.map(artist => artist.name).join(', '),
            duration: formatDuration(item.duration_ms),
            album: {
                name: item.album.name,
                coverImageUrl: largeImage ? largeImage.url : null,
            }
        };
    });

    return formattedTracks;

  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token do Spotify expirado. A obter um novo e a tentar novamente...');
      await getAccessToken();
      return searchTracks(query); 
    }

    console.error('Erro ao pesquisar músicas no Spotify:', error.response ? error.response.data : error.message);
    throw new Error('Falha ao buscar músicas no Spotify.');
  }
};

const getTrackDetails = async (trackId) => {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const track = response.data;
    const largeImage = track.album.images.find(img => img.width === 640) || track.album.images[0];

 
    return {
      spotifyID: track.id,
      trackName: track.name,
      artistName: track.artists.map(artist => artist.name).join(', '),
      albumName: track.album.name,
      albumCoverURL: largeImage ? largeImage.url : null,
      durationMs: track.duration_ms,
    };

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    if (error.response && error.response.status === 401) {
      console.log('Token do Spotify expirado. A obter um novo e a tentar novamente...');
      await getAccessToken();
      return getTrackDetails(trackId);
    }
    console.error(`Erro ao buscar detalhes da música ${trackId} no Spotify:`, error.message);
    throw new Error('Falha ao buscar detalhes da música no Spotify.');
  }
};


module.exports = {
  searchTracks,
  getTrackDetails, 
};