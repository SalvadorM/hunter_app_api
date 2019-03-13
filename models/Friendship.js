module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('friendship', {
        status: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        action: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })

    return Friendship
}