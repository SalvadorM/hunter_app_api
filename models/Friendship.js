module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('friendship', {
        id: {
            type: DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true 
        },
        status: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        actionUser: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })

    return Friendship
}