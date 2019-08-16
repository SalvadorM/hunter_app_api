const express = require('express')
const db = require('../config/database')

//model
const Message = db.Message 
const Chat= db.Chat
const User = db.User

const ChatController = {
    chatRouter(){
        const router = express.Router()

        //routes 
        router.post('/messages/new', this.newChatMessage)
        router.get('/messages/:chatid', this.getChatMessages)
        router.get('/info/:chatid', this.getChatInfo)
        router.get('/error', this.error)

        return router;
    },

    //@route    POST chat/messages/new
    //@desc     save new message to database
    async newChatMessage(req, res) {
        try{
            const userSessionId = req.user.id
            const otherUserId = req.body.otherUserId
            const message = req.body.message  

            const profileUser = await User.findByPk(userSessionId)
            const otherProfileUser = await User.findByPk(otherUserId)
            const chatName = `chatM-${userSessionId}-${otherUserId}`
            const newMessage = await Message.create({actionUser: userSessionId, body: message})
            const newChat = await Chat.create({chatName})

            const profile_1_res = newChat.addMember(profileUser)
            const profile_2_res = newChat.addMember(otherProfileUser)
            const newMessageRes = newChat.addMessage(newMessage)

            res.json(newMessage)


        } catch(e) {
            console.log(e)
            res.status(400).send(e)
        }
    },

    //@route    POST chat/messages/new
    //@desc     save new message to database
    async getChatMessages(req, res) {
        try{
            const chatId = req.params.chatid

            const currentChat = await Chat.findByPk(chatId)
            const messages = await currentChat.getMessages({
                include: [{
                    model: User,
                    attributes: { exclude: ['password','updatedAt']}
                }],
                
            })
            res.json(messages)
            
        } catch(e) {
            console.log(e)
            res.status(400).send(e)
        }
    },
    
    //@route    POST chat/users/chatid
    //@desc     save new message to database
    async getChatInfo(req, res) {
        try{
            const chatId = req.params.chatid 
            const chatRoom = await ChatRoom.findByPk(chatId)

            console.log(chatRoom)
            res.json(chatRoom)

        } catch(e) {
            console.log(e)
            res.status(400).send(e)
        }
    },

    //@route    GET comment/error
    //@desc     not authorized 
    error(req, res) {
        res.sendStatus(401)
    },
}


module.exports = ChatController.chatRouter()