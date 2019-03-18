const express = require('express')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require('../config/database')

const Friendship = db.Friendship
const User = db.User


const FriendshipController = {
    friendshipRouter(){
        const router = express.Router()

        router.post('/friendrequest', this.sendFriendRequest)
        router.post('/acceptrequest', this.acceptFriendRequest)
        router.get('/friendlist', this.getFriendList)

        return router
    },

    //@route    POST friendship/friendrequest 
    //@desc     Inserting a new friend request, from user in sessions to userId_2 
    async sendFriendRequest(req, res){
        const requestedFriend = parseInt(req.body.request)
        //userId_1 < userId_2
        const userId_1 = (req.user.id < requestedFriend) ? req.user.id : requestedFriend
        const userId_2 = (req.user.id < requestedFriend) ? requestedFriend : req.user.id 

        try{ 
            const friendshipData = { 
                userId_1,
                userId_2,
                status: 0,
                actionUser: req.user.id
            }
            const friendship = Friendship.create(friendshipData)
            res.json(friendshipData)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }

    },

    //@route    POST friendship/acceptrequest 
    //@desc     Accept the friend request 
    async acceptFriendRequest(req, res){
        const acceptFriend = parseInt(req.body.request)
        //userId_1 < userId_2
        const userId_1 = (req.user.id < acceptFriend) ? req.user.id : acceptFriend
        const userId_2 = (req.user.id < acceptFriend) ? acceptFriend : req.user.id 


        //get user sequelize obj
        try{
            //action -> 1 => friend accepted / both are friends
            //addFriends     bi-directional flow 
            const friendshipData = { 
                userId_1,
                userId_2,
                status: 1,
                actionUser: req.user.id
            }

            //update friendship status 
            const friendship = Friendship.update(friendshipData, {where: {userId_1, userId_2}})

            const user1 = await User.findByPk(userId_1)
            const user2 = await User.findByPk(userId_2)

            //add bi-directional 
            const user1_responce = await user1.addFriend(user2)
            const test2_responce = await user2.addFriend(user1)

            res.json(friendshipData)

        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
    //@route    GET friendship/friendlist 
    //@desc     get a list of user who are friends with session user 
    async getFriendList(req, res){
        const sessionUser = req.user.id
        try{
            const user1 = await User.findByPk(sessionUser)

            const uList = await user1.getFriends({ attributes: { inlude: ['password','createdAt']}})
            res.json(uList)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }

}


module.exports = FriendshipController.friendshipRouter()

