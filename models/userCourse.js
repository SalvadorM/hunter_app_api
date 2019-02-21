module.exports = (sequelize, DataTypes) => {
    const userCourse = sequelize.define('user_course', {
        year: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        season: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    })

    return userCourse
}