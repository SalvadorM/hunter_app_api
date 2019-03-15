const express = require('express')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require('../config/database')

const Friendship = db.Friendship


const FriendshipController = {
    friendshipRouter(){
        const router = express.Router()

        router.post('/friendrequest', this.sendFriendRequest)
        router.post('/acceptrequest', this.acceptFriendRequest)
        router.get('/checkfriendship/:request', this.checkFriendshipStatus)
        router.get('/friendlist', this.getFriendList)

        return router
    },

    //@route    POST friendship/friendrequest 
    //@desc     Inserting a new friend request, from user in sessions to userId_2 
    sendFriendRequest(req, res){
        const requestedFriend = parseInt(req.body.request)
        //userId_1 < userId_2
        const userId_1 = (req.user.id < requestedFriend) ? req.user.id : requestedFriend
        const userId_2 = (req.user.id < requestedFriend) ? requestedFriend : req.user.id 

        // status is set to zero -> request sent 
        const friendshipData = {
            userId_1, 
            userId_2,
            status: 0,
            action: req.user.id
        }
        //make sure there is no duplicate
        Friendship.create(friendshipData)
            .then(data =>{
                res.json(data)
            })
            .catch(err => res.status(400).send(err))
    },

    //@route    POST friendship/acceptrequest 
    //@desc     Accept the friend request 
    acceptFriendRequest(req, res){
        const acceptFriend = parseInt(req.body.request)
        //userId_1 < userId_2
        const userId_1 = (req.user.id < acceptFriend) ? req.user.id : acceptFriend
        const userId_2 = (req.user.id < acceptFriend) ? acceptFriend : req.user.id 
        
        // status is set to 1 -> accept request 
        const friendshipData = {
            userId_1, 
            userId_2,
            status: 1,
            action: req.user.id
        }
        Friendship.update(
            {action: friendshipData.action, status: friendshipData.status},
            {where: {userId_1,userId_2}})
            .then(data => {
                if(data[0] === 0){
                    res.status(400).send('Error could not update row')
                }
                res.json(data)
            })
            .catch(err => res.status(400).send(err))

    },

    //@route    GET friendship/checkfriendship 
    //@desc     check the status between friends 
    checkFriendshipStatus(req, res){
        const checkFriend = parseInt(req.params.request)
        //userId_1 < userId_2
        const userId_1 = (req.user.id < checkFriend) ? req.user.id : checkFriend
        const userId_2 = (req.user.id < checkFriend) ? checkFriend : req.user.id 
        
        Friendship.find({where: {userId_1, userId_2}})
            .then(data => {
                if(data === null) res.status(400).send('No Friendship Found')
                res.json(data)
            })
            .catch(err => res.status(400).send(err))
    },
    //@route    GET friendship/friendlist 
    //@desc     get a list of user who are friends with session user 
    getFriendList(req, res){
        const sessionUser = req.user.id

        Friendship.findAll({
            where: {
                [Op.or]: [{userId_1: sessionUser},{userId_2: sessionUser}],
                status: 1
            }
         })
         .then(friendList => {
             res.json(friendList)
         })
         .catch(err => res.status(400).send(err))
    }

}


module.exports = FriendshipController.friendshipRouter()