module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('chat', {
        chatName: {
            type: DataTypes.STRING(),
            allowNull: false,
            validate: {
                notEmpty: true
            },  
        }, 
    })

    return Chat
}