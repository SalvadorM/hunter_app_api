const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const db = require('../config/database')

//user models
const User = db.User

const userController = {
    //main funcß
    userRouter() {

        const router = express.Router()

        router.get('/:id', this.getUserById)

        return router
    },

    //@route    GET user/:id
    //@desc     Get the user from database
    getUserById(req,res){
        User.findByPk(req.params.id)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.json(err)
        })
    },

}

module.export = userController.userRouter()