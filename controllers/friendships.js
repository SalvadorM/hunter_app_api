const express = require('express')
const db = require('../config/database')

const Friendship = db.Friendship


const FriendshipController = {
    friendshipRouter(){
        const router = express.Router()

        router.post('/friendrequest', this.friendRequest)

        return router
    },

    //@route    POST friendship/friendrequest 
    //@desc     Inserting a new friend request, from user in sessions to userId_2 
    friendRequest(req, res){
        const requestedFriend = parseInt(req.body.request)
        //userId_1 < userId_2
        const userId_1 = (req.user.id < requestedFriend) ? req.user.id : requestedFriend
        const userId_2 = (req.user.id < requestedFriend) ? requestedFriend : req.user.id 

    
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
            .catch(err => {
                console.log(err)
                res.status(400).send(err)
            })
    },

}


module.exports = FriendshipController.friendshipRouter()