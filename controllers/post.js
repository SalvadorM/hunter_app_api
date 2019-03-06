const express = require('express')
const db = require('../config/database')
const Sequelize = require('sequelize')

const Post = db.Post
const Op = Sequelize.Op

const PostController = {
    postRouter(){
        const router = express.Router()

        //routes
        router.get('/getAllPost', this.getAllPost)
        router.get('/all/:id', this.allUserPosts)
        router.get('/search/:value/keywords/', this.searchInPosts)
        router.post('/new/', this.createNewPost)
        router.get('/:id', this.getPostById)
        router.delete('/:id', this.deletePost)
        router.get('/error', this.error)

        return router
    },

    //@route    GET post/all/:id
    //@desc     get all the notes from userId
    allUserPosts(req,res){
        const userId = req.params.id

        Post.findAll({ where: {userId}})
            .then(post => {
                res.json(post)
                
            })
            .catch(err => res.status(400).send(err))
    },

    //@route    GET post/all
    //@desc     get all the post in database
    getAllPost(req, res) {
        Post.findAll()
            .then(posts => {res.json(posts)})
            .catch(err => res.status(400).send(err))
    },
    
    //@route    GET post/all
    //@desc     get post information by postId
    getPostById(req, res){
        const postId = req.params.id

        Post.findById(postId)
            .then(post => {res.json(post)})
            .catch(err => res.status(400).send(err))
    },

    //@route    POST post/new
    //@desc     create a new post using courseId
    createNewPost(req, res) {
        const title = req.body.title
        const body = req.body.body
        const userId = req.user.id
    
        Post.create({body, title, postId, userId})
            .then(newPost => {res.json(newPost)})
            .catch(err => res.status(400).send(err))
    },

    //@route    GET /search/:value/keywords/
    //QUERY     keywordsQuery
    //@desc     parse the url, search according to query data
    searchInPosts(req, res){

        //parse url and get what to attribute to search in note
        let searchVal = req.url.split('/')
        searchVal = searchVal[2]

        //create a query of keywords to search in note attribute 
        let keywordsQuery = req.query 
        let query = []

        for (let key in keywordsQuery) {
            query.push({ [Op.iLike]: '%' + keywordsQuery[key] + '%' })
        }
       
        let qry = {
            where: {[searchVal]: { [Op.or]: query }}
            }
        
        console.log(qry)

        //return all unique notes found 
        Post.findAll(qry)
            .then ( responce => {res.json(responce)})
            .catch(err => console.log(err))
    },

    //@route    DELETE post/:id
    //@desc     DELETE delete a post
    deletePost(req, res) {
        const postId = req.params.id
        const User = req.user
                
        if(!currUser){
            res.redirect('/comment/error')
        } else { 
            Post.destroy({ where: {id: postId,userId: User.id}})
                .then(responce => {res.json({succes: responce})})
                .catch(err => res.status(400).send(err))
            }    
    }, 

    //@route    GET user/error
    //@desc     not authorized 
    error(req, res) {
      res.sendStatus(401)
    },

}

module.exports = PostController.postRouter()