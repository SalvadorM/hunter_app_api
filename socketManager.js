const io = require('./server').io

module.exports = (socket) => {
    console.log(`connected to socket ${socket.id}`)

    socket.on('chat message', (data) => {
        console.log(data)
    })
}