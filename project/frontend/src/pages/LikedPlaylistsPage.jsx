import React from 'react';

function LikedPlaylistsPage() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">Playlists Curtidas</h1>
        <p className="mt-2 text-gray-700">Suas playlists favoritas.</p>
      </div>
    </div>
  );
}

export default LikedPlaylistsPage;
