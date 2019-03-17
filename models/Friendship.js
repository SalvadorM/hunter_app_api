module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('friendship', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
    })

    return Friendship
}