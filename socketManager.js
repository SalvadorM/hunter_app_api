const io = require('./server').io

module.exports = (socket) => {
    console.log(`connected to socket ${socket.id}`)

    socket.on('subscribe', (data) => {
        console.log(data)
        socket.join(data.chatId)
    })

    socket.on('send message', (data) => {
        console.log('messae is being sent', data)
        io.to(data.chatId).emit('new message', data)
    })



}