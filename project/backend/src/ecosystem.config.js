module.exports = {
  apps : [
    {
      name: 'app-user',
      script: 'app-user.js',
      watch: true, 
      env: {
        NODE_ENV: 'development',
        PORT: 2100, // Porta para o app-user
      },
    },
    {
      name: 'app-badge',
      script: 'app-badge.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 2150, // Porta para o app-badge
      },
    },
    {
      name: 'app-playlist',
      script: 'app-playlist.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 2200, // Porta para o app-playlist
      },
    },
    {
      name: 'app-tag',
      script: 'app-tag.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 2250, // Porta para o app-tag
      },
    },
    {
      name: 'app-track',
      script: 'app-track.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 2300, // Porta para o app-track
      },
    }
  ]
};