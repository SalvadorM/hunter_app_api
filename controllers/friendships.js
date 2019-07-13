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
        router.delete('/removefriend/:userid', this.removeFriend)
        router.get('/friendlist', this.getFriendList)
        router.get('/checkstatus/:friendid', this.checkStatus)
        router.get('/profilefriendslist/:userid', this.getProfileFriendList)
        router.get('/requestlist', this.getFriendRequestList)
        router.get('/isfriend/:friendid', this.isFriend)

        return router
    },

    //@route    POST friendship/friendrequest 
    //@desc     Inserting a new friend request, from user in sessions to userId_2 
    async sendFriendRequest(req, res){
        try{ 
            const requestedFriend = parseInt(req.body.request)
            //userId_1 < userId_2
            const userId_1 = (req.user.id < requestedFriend) ? req.user.id : requestedFriend
            const userId_2 = (req.user.id < requestedFriend) ? requestedFriend : req.user.id 
    
            const friendshipData = { 
                userId_1,
                userId_2,
                status: 0,
                actionUser: req.user.id
            }
            const friendship = await Friendship.create(friendshipData)
            res.json(friendshipData)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }

    },

    //@route    POST friendship/checkstatus
    //@desc     checks for the stautus of friendship 
    async checkStatus(req, res){
        try{ 
            const requestedFriend = parseInt(req.params.friendid)
   
            //userId_1 < userId_2
            const userId_1 = (req.user.id < requestedFriend) ? req.user.id : requestedFriend
            const userId_2 = (req.user.id < requestedFriend) ? requestedFriend : req.user.id 
            console.log(userId_1, userId_2)
            const friendship = await Friendship.findOne({where: {userId_1, userId_2}})
            res.json(friendship)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    //@route    POST friendship/acceptrequest 
    //@desc     Accept the friend request 
    async acceptFriendRequest(req, res){
        try{
            const acceptFriend = parseInt(req.body.request)
            //userId_1 < userId_2
            const userId_1 = (req.user.id < acceptFriend) ? req.user.id : acceptFriend
            const userId_2 = (req.user.id < acceptFriend) ? acceptFriend : req.user.id 
    
    
            //get user sequelize obj
            //action -> 1 => friend accepted / both are friends
            //addFriends     bi-directional flow 
            const friendshipData = { 
                userId_1,
                userId_2,
                status: 1,
                actionUser: req.user.id
            }

            //update friendship status 
            const friendship = await Friendship.update(friendshipData, {where: {userId_1, userId_2}})

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
        try{
            const sessionUser = req.user.id

            const user1 = await User.findByPk(sessionUser)

            const uList = await user1.getFriends({ 
                attributes: { exclude: ['password','createdAt', 'friends']},
            })
            res.json(uList)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    //@route    DELETE friendship/removefriend/:userid 
    //@desc     remove bi-directional link between users and update friendship status
    async removeFriend(req, res){
         try{
            const friendToRemove = parseInt(req.params.userid)
            //userId_1 < userId_2
            const userId_1 = (req.user.id < friendToRemove) ? req.user.id : friendToRemove
            const userId_2 = (req.user.id < friendToRemove) ? friendToRemove : req.user.id 
    
            //friendship object attributes for friendship
            const friendshipData = { 
                userId_1,
                userId_2,
                status: 3,
                actionUser: req.user.id
            }
            //find users to use functions
            const sessionUser = await User.findByPk(req.user.id)
            const userToRemove = await User.findByPk(friendToRemove)

            //remove friend bi-directional link
            const userIdRemoved = await sessionUser.removeFriend(userToRemove)
            const friendIdRemoved = await userToRemove.removeFriend(sessionUser)

            //update friendship 
            const friendship = await Friendship.update(friendshipData, {where: {userId_1, userId_2}})
            res.json(friendshipData)
            
        }
        catch(err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    //@route    GET friendship/requestlist 
    //@desc     get a list of request sent to the user
    async getFriendRequestList(req, res){
        try{
            const sessionUser = req.user.id

            const uList = await Friendship.findAll({
                where: {
                    [Op.or]: [{userId_1: sessionUser}, {userId_2: sessionUser}],
                    actionUser: {[Op.ne]: sessionUser},
                    status: 0,
                },
                attributes: { },
                raw: true,
              }) 
            let friendReqList = []
            for (let req in uList){
                 let { actionUser, status } = uList[req]
                
                 if( status === 0) {
                     let friendReq = await User.findByPk(actionUser, {attributes: { exclude: ['password','updatedAt']}, raw: true})
                     let friend = {
                         id: friendReq.id,
                         username: friendReq.username
                     }
                     friendReqList.push(friend)
                }
            }
            res.json(friendReqList)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        } 
    },

    //@route    friendship/isfriend/:friendid
    //@desc     check if session user and friednid are friends 
    async isFriend(req, res){
        try{ 
            const isFriendId = parseInt(req.params.friendid)
            //userId_1 < userId_2
            const userId_1 = (req.user.id < isFriendId) ? req.user.id : isFriendId
            const userId_2 = (req.user.id < isFriendId) ? isFriendId : req.user.id 
    
            let fsRes = await Friendship.findAll({
                where: {
                    userId_1,
                    userId_2,
                    status: 1,
                },
                raw: true,
            })
            let areFriends = (fsRes.length === 1)? true : false
            res.json({
                friend: areFriends
            })
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    async getProfileFriendList(req, res){
        try{
            const profileUser = req.params.userid

            const user1 = await User.findByPk(profileUser)

            const uList = await user1.getFriends({ 
                attributes: { exclude: ['password','createdAt', 'friends']},
            })
            res.json(uList)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        } 
    }
}


module.exports = FriendshipController.friendshipRouter()

