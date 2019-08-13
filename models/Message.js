module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        body: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        actionUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }

    })

    return Message
}