const Sequelize = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

const User = require('./User')(sequelize);
const Playlist = require('./Playlist')(sequelize);
const Tags = require('./Tags')(sequelize);
const Badges = require('./Badges')(sequelize);
const Track = require('./Track')(sequelize);

const UserPlaylistLiked = require('./UserPlaylistLiked')(sequelize);
const UserFollow = require('./UserFollow')(sequelize);
const UserBadge = require('./UserBadge')(sequelize);
const PlaylistTrack = require('./PlaylistTrack')(sequelize);
const PlaylistTag = require('./PlaylistTag')(sequelize);

// --- Associações da Entidade Usuário --- //

// Usuário e Playlist - Um usuário pode criar várias playlists
User.hasMany(Playlist, {
    foreignKey: 'creator_id',
    as: 'createdPlaylists',
});

// Playlist e Usuário - Uma playlist pertence a um usuário
Playlist.belongsTo(User, {
    foreignKey: 'creator_id',
    as: 'creator',
});

// Usuário e Playlist Curtida - Um usuário pode curtir várias playlists
User.belongsToMany(Playlist, {
    through: UserPlaylistLiked,
    foreignKey: 'user_id',
    otherKey: 'playlist_id',
    as: 'likedPlaylists',
});

// Playlist e Usuário Curtido - Uma playlist pode ser curtida por vários usuários
Playlist.belongsToMany(User, {
    through: UserPlaylistLiked,
    foreignKey: 'playlist_id',
    otherKey: 'user_id',
    as: 'likedByUsers',
});

// Usuario e Usuario - um usuário pode seguir vários outros usuários (seguindo)
User.belongsToMany(User, {
    through: UserFollow,
    foreignKey: 'follower_id',
    otherKey: 'followed_id',
    as: 'following',
});

// Usuario e Usuario - um usuário pode ser seguido por vários outros usuário (seguidores)
User.belongsToMany(User, {
    through: UserFollow,
    foreignKey: 'followed_id',
    otherKey: 'follower_id',
    as: 'followers',
});

// Usuário e Badges - Um usuário pode ter várias badges
User.belongsToMany(Badges, {
    through: UserBadge,
    foreignKey: 'user_id',
    otherKey: 'badge_id',
    as: 'userBadges',
});

// Badges e Usuário - Uma badge pode ser adquirida por vários usuários
Badges.belongsToMany(User, {
    through: UserBadge,
    foreignKey: 'badge_id',
    otherKey: 'user_id',
    as: 'usersWithBadges',
});

// Playlist e Track - Uma playlist pode ter várias tracks
Playlist.belongsToMany(Track, {
    through: PlaylistTrack,
    foreignKey: 'playlist_id',
    otherKey: 'track_id',
    as: 'tracks',
});

// Track e Playlist - Uma track pode pertencer a várias playlists
Track.belongsToMany(Playlist, {
    through: PlaylistTrack,
    foreignKey: 'track_id',
    otherKey: 'playlist_id',
    as: 'playlists',
});

// Playlist e Tags - Uma playlist pode ter várias tags
Playlist.belongsToMany(Tags, {
    through: PlaylistTag,
    foreignKey: 'playlist_id',
    otherKey: 'tag_id',
    as: 'tags',
});

// Tags e Playlist - Uma tag pode ser associada a várias playlists
Tags.belongsToMany(Playlist, {
    through: PlaylistTag,
    foreignKey: 'tag_id',
    otherKey: 'playlist_id',
    as: 'playlists',
});


module.exports = {
    sequelize,
    User,
    Playlist,
    Tags,
    Badges,
    Track,
    UserPlaylistLiked,
    UserFollow,
    UserBadge,
    PlaylistTrack,
    PlaylistTag,
};