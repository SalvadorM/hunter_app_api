module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define('chatroom', {
        chatMember: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: true
            },  
        }, 
        chatId: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: true
            },  
        }, 
    })

    return ChatRoom
}