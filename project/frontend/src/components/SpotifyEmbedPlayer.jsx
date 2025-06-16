import React from 'react';
import { usePlayer } from '../contexts/PlayerContext.jsx';


function SpotifyEmbedPlayer() {
  const { currentPlayingSpotifyUri } = usePlayer();

  const spotifyTrackId = currentPlayingSpotifyUri ? currentPlayingSpotifyUri.split(':').pop() : null;
  
  const embedUrl = spotifyTrackId
    ? `https://open.spotify.com/embed/track/${spotifyTrackId}?autoplay=1`
    : null;


  const playerHeight = '80px'; 
  
  if (!spotifyTrackId) { 
    return null;
  }

  return (

    <div 
      className="fixed shadow-lg" 
      style={{ 
        height: playerHeight, 
        bottom: '20px',             
        left: '290px',              
        width: '1600px',             
        zIndex: 40,                 
      }}
    >
      <iframe
        src={embedUrl}
        width="100%" 
        height="100%" 
        allowtransparency="true"
        allow="encrypted-media; autoplay;" 
        title="Spotify Embed Player"
      ></iframe>

    </div>
  );
}

export default SpotifyEmbedPlayer;