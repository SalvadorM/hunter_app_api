module.exports = (sequelize, DataTypes) => {
    const Semester = sequelize.define('semester', {
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

    return Semester
}