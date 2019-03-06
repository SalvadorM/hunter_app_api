module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        body: {
            type: DataTypes.STRING(400),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    })

    return Post
}