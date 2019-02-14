
module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('course', {
        classCode: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        className: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        section: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        information: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    })

    return Course
}