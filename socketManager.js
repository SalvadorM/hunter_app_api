const io = require('./server').io
const db = require('./config/database')

const Chat = db.Chat
const Message = db.Message

module.exports = (socket) => {
    /*
        make user joing the chat room using chatId
    */
    socket.on('subscribe', (data) => {

        console.log(`user: ${data.userId} is joining room: ${data.chatId}`)
        console.log(`user: ${data.userId} is socket: ${socket.id}`)
        socket.join(data.chatId)
    })


    /*
        new message gets store to database 
        notify users in chatId room that new message has been stored
    */
    socket.on('send message', async (data) => {

        try{
            const chatId = data.chatId
            const currentUser = data.userId
            const messageBody = data.message

            const currentChat = await Chat.findByPk(chatId)
            const message = await Message.create({actionUser: currentUser, body: messageBody})
            const addedMessage = await currentChat.addMessage(message)

            console.log('New Message has been stored', data)

            io.to(data.chatId).emit('new message', addedMessage)
    

        } catch(e) {
            console.log(e)

        }
    })

    /*
        USER DISCONNET
    */
}