const express = require('express')
const db = require('../config/database')

//model
const Comment = db.Comment 

const CommentController = {
    commentRouter(){
        const router = express.Router()

        //routes 
        router.post('/new/', this.postNewComment)
        router.get('/post/all/:id', this.getPostComments)
        router.get('/user/all/:id', this.getUserComments)
        router.delete('/:id', this.deleteComment)
        router.get('/error', this.error)

        return router;
    },

    //@route    POST comment/new
    //@desc     create a new comment on postId 
    postNewComment(req, res) {
    const postId = req.body.postId
    const body = req.body.commentBody
    const votes = 0
    const userId = req.user.id

    Comment.create({body,votes,userId,postId,})
        .then(comment => {res.json(comment)})
        .catch(err => res.status(400).send(err))

    },

    //@route    GET comment/postall/:id
    //@desc     get all the comments from postId
    getPostComments(req, res) {
        const postId = req.params.id

        Comment.findAll({where: {postId}})
            .then(comments => {res.json(comments)})
            .catch(err => res.status(404).send(err))
    },

    //@route    GET comment/user/:id
    //@desc     get all the comments by UserId
    getUserComments(req, res) {
        const userId = req.params.id

        Comment.findAll({where: {userId}})
            .then(comments => {res.json(comments)})
            .catch(err => res.status(404).send(err))
    },
    
    //@route    DELETE comment/:id
    //@desc     delete a comment by session user
    deleteComment(req, res) {
        const commentId = req.params.id
        const User = req.user
        
        if(!User) {
             res.redirect('/comment/error')
        } else {
            Comment.destroy({ where: 
                {
                    id: commentId,
                    userId: User.id
                }
            })
                .then(responce => {
                    res.json({succes: responce})
                })
                .catch(err => res.send(err))
        }
    },

    //@route    GET comment/error
    //@desc     not authorized 
    error(req, res) {
        res.sendStatus(401)
    },
}

module.exports = CommentController.commentRouter()