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
        router.get('/checkfriendship/:request', this.checkFriendshipStatus)
        router.get('/friendlist', this.getFriendList)

        return router
    },

    //@route    POST friendship/friendrequest 
    //@desc     Inserting a new friend request, from user in sessions to userId_2 
    sendFriendRequest(req, res){
 
    },

    //@route    POST friendship/acceptrequest 
    //@desc     Accept the friend request 
    acceptFriendRequest(req, res){
    },

    //@route    GET friendship/checkfriendship 
    //@desc     check the status between friends 
    checkFriendshipStatus(req, res){

    },
    //@route    GET friendship/friendlist 
    //@desc     get a list of user who are friends with session user 
    getFriendList(req, res){
    }

}


module.exports = FriendshipController.friendshipRouter()