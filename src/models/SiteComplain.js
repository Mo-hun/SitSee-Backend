export const SiteComplain = (sequelize, DataTypes) => {
    return sequelize.define('site_complain', {
        complainidx: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        useridx: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        code: {
            type: DataTypes.INTEGER(16),
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        pw: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    })
}