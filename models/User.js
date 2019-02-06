
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isAlphanumeric: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            },
        },
    })

    return User
}