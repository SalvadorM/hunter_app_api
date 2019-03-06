module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('comment', {
        body: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        votes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    })

    return Comments
}