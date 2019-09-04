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
        router.post('/messages/createchat', this.createNewChat)
        router.post('/messages/new', this.addNewMessage)
        router.get('/messages/:chatid', this.getChatMessages)
        router.get('/info/:chatid', this.getChatInfo)
        router.get('/userchats', this.getUserChats)
        router.get('/ismember/:chatid', this.isUserChatMember)
        router.get('/error', this.error)

        return router;
    },

    //@route    POST chat/messages/new
    //@desc     save new message to database
    async addNewMessage(req, res){
        try {
            const chatId = req.body.chatid
            const currentUser = req.user.id
            const messageBody = req.body.message

            const currentChat = await Chat.findByPk(chatId)
            const message = await Message.create({actionUser: currentUser, body: messageBody})
            const addedMessage = await currentChat.addMessage(message)

            console.log(addedMessage)
            res.json({
                succes: true
            })
            
            
        } catch(e){
            console.log(e)
            res.status(400).send(e)
        }
    },

    //@route    POST chat/messages/createChat
    //@desc     create a new message chat 
    async createNewChat(req, res) {
        try{
            const userSessionId = req.user.id
            const otherUserId = req.body.otherUserId
            const message = req.body.message  

            const profileUser = await User.findByPk(userSessionId)
            const otherProfileUser = await User.findByPk(otherUserId)
            const chatName = `chat-${profileUser.username}-${otherProfileUser.username}`

            //create new message 
            const newMessage = await Message.create({actionUser: userSessionId, body: message})

            //create new chat
            const newChat = await Chat.create({chatName})

            //add members to chat 
            const profile_1_res = newChat.addMember(profileUser)
            const profile_2_res = newChat.addMember(otherProfileUser)

            //add chat to user
            const userChat_1_res = profileUser.addChat(newChat)
            const userChat_2_res = otherProfileUser.addChat(newChat)

            //add messafe to chat
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
                // scope: null,
                attributes: { exclude: ['chatId',]},
                include: [{
                    model: User,
                    attributes: { exclude: ['password','updatedAt','createdAt', 'chatId', 'name', 'email']}
                }],
                // order: [['createdAt', 'DESC']],
                raw: true,
                
            })

            const cleanMessages = messages.map((val, i) => {
                    let tmp = {
                     messageBody: val.body, 
                     actionUser: val.actionUser,
                     actionUsername: val['user.username'],
                     createdAt: val.createdAt,
                    }
                    return tmp
            })

            res.json(cleanMessages)
            
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
            const chatRoom = await Chat.findByPk(chatId)

            console.log(chatRoom)
            res.json(chatRoom)

        } catch(e) {
            console.log(e)
            res.status(400).send(e)
        }
    },
        
    //@route    GET chat/userid 
    //@desc     get userid chats 
    async getUserChats(req, res) {
        try{
            const userId = req.user.id

            const userFound = await User.findByPk(userId)

            const userChats = await userFound.getChats()

            res.json(userChats)

        } catch(e) {
            console.log(e)
            res.status(400).send(e)
        }
    },

            
    //@route    GET chat/userid 
    //@desc     check if user in a chat member
    async isUserChatMember(req, res){
        try{
            const sessionUser = req.user.id 
            const chatId = req.params.chatid 

            const currentChat = await Chat.findByPk(chatId)

            if(currentChat) {
                const chatUsers = await currentChat.getMembers({raw: true})

                let userFound = false 
                for (user in chatUsers) {
                    if(chatUsers[user].id === sessionUser){
                        userFound = true
                    }
                }
    
                res.json({
                    success: userFound
                })
            } else {
                res.json({ success: false})
            }


        } catch(e) {
            console.log(e)
            res.status(400).send(e)
        }
    },

    //@route    GET chat/error
    //@desc     not authorized 
    error(req, res) {
        res.sendStatus(401)
    },
}


module.exports = ChatController.chatRouter()