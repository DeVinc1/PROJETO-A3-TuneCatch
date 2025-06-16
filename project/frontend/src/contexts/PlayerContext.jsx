import React, { createContext, useContext, useState, useCallback } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentPlayingSpotifyUri, setCurrentPlayingSpotifyUri] = useState(null); 
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  
  const playTrack = useCallback((trackSpotifyId, trackInternalId) => {
    setCurrentPlayingSpotifyUri(`spotify:track:${trackSpotifyId}`);
    setSelectedTrackId(trackInternalId); 
    console.log(`Definindo para reprodução: spotify:track:${trackSpotifyId}`);
  }, []);

  const stopTrack = useCallback(() => {
    setCurrentPlayingSpotifyUri(null);
    setSelectedTrackId(null);
    console.log("Parando reprodução.");
  }, []);

  const value = {
    currentPlayingSpotifyUri,
    selectedTrackId,
    playTrack,
    stopTrack,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
