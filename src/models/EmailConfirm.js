

export const EmailConfirm = (sequelize, DataTypes) => {
    return sequelize.define('email_confirm', {
        confirmidx: {
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
        code: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    })
}
