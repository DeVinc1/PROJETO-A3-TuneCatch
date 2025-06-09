const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Badges = sequelize.define('Badges', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            fieldname: 'id',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            fieldname: 'name',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            fieldname: 'description',
        },
        iconURL: {
            type: DataTypes.STRING,
            allowNull: false,
            fieldname: 'icon_url',
            unique: true,
            validate: {
                isUrl: true,
            },
            defaultValue: 'https://example.com/default-badge-icon.png', //TODO - Mudar para URL do ícone de badge padrão válida
        },
    },{
        tableName: 'badges',
        timestamps: false,
    });
    return Badges;
}
