export const UserInfo = (sequelize, DataTypes) => {
    return sequelize.define('user_info', {
        useridx: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        grade: {
            type: DataTypes.INTEGER(16),
            allowNull: true
        },
        class: {
            type: DataTypes.INTEGER(16),
            allowNull: true
        },
        no: {
            type: DataTypes.INTEGER(16),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(12),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        gender: {
            type: DataTypes.INTEGER(16),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    })
}
