const express = require('express')
const db = require('../config/database')


//models 
const userCourse = db.userCourse
const Course = db.Course
const User = db.User

const uCourseController = {
    uCourseRouter(){
        const router = express.Router()

        router.get('/all', this.getAll)
        router.get('/classmates', this.findClassmates)

        return router 
    },
    //@route    GET usercourse/all
    //@desc     Get the all the users from database
    getAll(req, res) {
        userCourse.findAll()
            .then(courses => {
                res.json(courses)
            })  
            .catch(err => res.status(400).send(err))
    },
    /*
    @route    GET usercourse/classmates?QUERY 
    PARAM     year
    PARAM     season
    PARAM     courseId
    @desc     get all the students from courseId
    */
    findClassmates(req, res){
        Course.findAll({
            include: User,
            through: {
                attributes: ['id']
            }
        })
        .then(data => {
            console.log(data)
            res.json(data)
        })
        .catch(err => res.status(400).send(err))
    },

    
    
}


module.exports = uCourseController.uCourseRouter()