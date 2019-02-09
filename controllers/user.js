const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const db = require('../config/database')

//user models
const User = db.User

const userController = {
    //main func
    userRouter() {

        const router = express.Router()

        //CRUD
        router.get('/find/:id', this.getUserById)
        router.get('/all', this.getAllUsers)
        router.get('/username/:username', this.getUserByUsername)
        router.post('/create', this.createUser)
        router.put('/update/:id', this.updateUser)
        router.delete('/:id', this.deleteUser)
        return router
    },

    //@route    GET user/:id
    //@params   id
    //@desc     Get the user from database
    getUserById(req,res){
        const userId = req.params.id
        User.findByPk(userId)
        .then(user => {
            if(user){
                const userInfo = {
                    username: user.username,
                    name: user.name,
                    email: user.email
                }
                res.json(userInfo)
            } else {
                res.status(500).json({
                    success: 'false',
                    message: 'Error: No user found'
                })
            }
        })
        .catch(err => res.status(400).send(err))
    },

    //@route    GET user/username/:username
    //@params   username
    //@desc     Get the user from database
    getUserByUsername(req,res){
        const username = req.params.username
        User.find({where : {username}})
        .then(user => {
            if(user){
                const userInfo = {
                    username: user.username,
                    name: user.name,
                    email: user.email
                }
                res.json(userInfo)
            } else {
                res.status(500).json({
                    success: 'false',
                    message: 'Error: No user found'
                })
            }
        })
        .catch(err => res.status(400).send(err))
    },

    //@route    GET user/all
    //@desc     Get the all the users from database
    getAllUsers(req, res){
        User.findAll()
            .then(users => {
                res.json(users)
            })
            .catch(err => res.status(400).send(err))
    },

    //@route    POST user/create
    //@desc     create new user in database
    createUser(req, res){
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name

        User.create({ username, email, password, name})
            .then(user => {
                res.json(user)
            })
            .catch(err => res.status(400).send(err))
    },

    //@route    DELETE user/:id
    //@params   id
    //@desc     delete a user record from database
    deleteUser(req, res){
        const userId = req.params.id
        User.destroy({where: {id: userId}})
            .then(user => {
                if(user === 1){
                    res.status(200).json({
                        success: 'true'
                    })
                }else {
                    res.status(400).json({
                        success: 'false',
                        message: 'Error: No user found'
                    })
                }
            })
            .catch(err => res.status(400).send(err))
    },

    //@route    PUT user/:id
    //@params   id
    //@desc     update user in database
    updateUser(req, res){
        const userId = req.params.id    
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name

        User.update({ username, email, password, name}, {where : {id: userId}})
            .then(responce => {
                if(responce[0] === 1){                  
                    res.status(200).json({
                        success: 'true'
                    })
                }else {
                    res.status(400).json({
                        success: 'false',
                        message: `Error: Could not update user: ${username}`
                    })
                }
            })
            .catch(err => res.status(400).send(err))
    }
}

module.exports = userController.userRouter()