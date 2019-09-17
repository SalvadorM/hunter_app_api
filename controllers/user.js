const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt-nodejs')
const db = require('../config/database')


//user models
const User = db.User
const Comment = db.Comment
const Post = db.Post 
const sequelize = db.sequelize 

const userController = {
    //main func
    userRouter() {

        const router = express.Router()

        //CRUD
        router.get('/find/:userid', this.getUserById)
        router.get('/all', this.getAllUsers)
        router.get('/username/:username', this.getUserByUsername)
        router.get('/info', this.userInfo)
        router.post('/create', this.createUser)
        router.put('/update/:id', this.updateUser)
        router.delete('/:id', this.deleteUser)
        router.post('/login', passport.authenticate('local', {failureRedirect: '/user/error'}), this.loginUser)
        router.post('/logout', this.logOut)
        router.get('/error', this.error)
        router.get('/test', this.testFunc)
        
        return router
    },

    async testFunc(req, res){
        try{

            bcrypt.hash('12345a', null, null, (err, hashedPassword) => {
                User.create({ username:'salva_awesome', email:"salvador@mail.com", password: hashedPassword, name:`Salvador`})
                    .then(user => console.log(user))
            })           
   

            bcrypt.hash('12345a', null, null, (err, hashedPassword) => {
                User.create({ username:'sarai_awesome2', email:"sarai@mail.com", password: hashedPassword, name:`Sarai`})
                    .then(user => console.log(user))
            })       

            res.json({status: true})
        } catch(e){
            console.log(e)
            res.status(400).send(e)
        }
    },
    //@route    GET user/:id
    //@params   id
    //@desc     Get the user from database
    getUserById(req,res){
        const userId = req.params.userid
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
        User.find({where : {username}, attributes: { exclude: ['password','updatedAt']}})
        .then(user => {
            if(user){
                res.json(user)
            } else {
                res.json({
                    error: false,
                    messageMessage: 'No user found'
                })
            }
        })
        .catch(err => res.status(400).send(err))
    },

    //@route    GET user/all
    //@desc     Get the all the users from database
    getAllUsers(req, res){
        User.findAll({ attributes: { exclude: ['password','updatedAt']}})
            .then(users => {res.json(users)})
            .catch(err => res.status(400).send(err))
    },

    //@route    POST user/create
    //@desc     create new user in database
    createUser(req, res){
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name


        User.findOne({ where: { username }})
            .then((foundUsername) => {
                if(!foundUsername){
                    User.findOne({ where: { email } })
                    .then(foundEmail => {
                        if(!foundEmail){
                            bcrypt.hash(password, null, null, (err, hashedPassword) => {
                                if(err) res.status(400).send(err)
                                User.create({ username, email, password: hashedPassword, name})
                                    .then(user => {res.json(user)})
                                    .catch(err => res.status(400).send(err))
                            })
                        }
                        else{
                            res.json({error: true, errorMessage: `Email is taken`})
                        }
                    })
                    .catch(err => {res.status(400).send(err)})
                }
                else{
                    res.json({error: true, errorMessage: `Username is taken`})
                }

            })
            .catch(err => {res.status(400).send(err)})

    },

    //@route    DELETE user/:id
    //@params   id
    //@desc     delete a user record from database
    deleteUser(req, res){
        const userId = req.params.id
        User.destroy({where: {id: userId}})
            .then(user => {
                if(user === 1){
                    res.status(200).json({success: 'true'})
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
        const userId = req.user.id    
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name

        bcrypt.hash(password, null, null, (err, hashedPassword) => {
            User.update({ username, email, password: hashedPassword, name}, {where : {id: userId}})
            .then(responce => {
                if(responce[0] === 1){                  
                    res.status(200).json({success: 'true'})
                }else {
                    res.status(400).json({
                        success: 'false',
                        message: `Error: Could not update user: ${username}`
                    })
                }
            })
            .catch(err => res.status(400).send(err))
        })
    },

    //@route    POST user/login
    //@desc     POST request to log in user in sessions using passport 
    loginUser(req, res) {
        req.session.save()
        console.log(`this is the ${req.headers.cookie}`)
        res.json({
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            username: req.user.username,
            cookie: req.headers.cookie
            })
    },
    //@route    GET user/info
    //@desc     GET request user info
    async userInfo(req, res){
        try{
            const userId = req.user.id
            let commentRes = await Comment.findAll({ attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'comment_len']], where: {userId} , raw: true} )
            let postRes = await Post.findAll({ attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'post_len']], where: {userId}, raw: true })

            //return 
            res.json({
                ...commentRes[0],
                ...postRes[0],
            })
        }
        catch(e){
            console.log(e)
            res.status(400).send(e)
        }   

    },

    //@route    POST user/logout
    //@desc     POST request to log out 
    logOut(req, res) {
        req.logout()
        res.json({msg: 'logged out',})

    },

    //@route    GET user/error
    //@desc     GET not authorized 
    error(req, res) {
        res.sendStatus(401)
    },
}

module.exports = userController.userRouter()