const Sequelize = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

const User = require('./User')(sequelize);
const Playlist = require('./Playlist')(sequelize);
const Tags = require('./Tags')(sequelize);
const Badges = require('./Badges')(sequelize);


const UserPlaylistLiked = require('./UserPlaylistLiked')(sequelize);
const UserFollow = require('./UserFollow')(sequelize);
const UserBadge = require('./UserBadge')(sequelize);

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

module.exports = {
    sequelize,
    User,
    Playlist,
    Tags,
    Badges,
    UserPlaylistLiked,
    UserFollow,
    UserBadge,
};