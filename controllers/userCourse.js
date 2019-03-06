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
        router.get('/userclasses', this.userClasses)

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
    QUERY     year
    QUERY     season
    QUERY     section????
    QUERY     courseId
    @desc     returns all the students from classcode
    */
    findClassmates(req, res){
        const query = req.query
 
        Course.findAll({
            include: [{model: User, required: true, attributes: ['id','name']}],
            where: { classCode: query.classcode},
        })
            .then(data => {
                res.json(data)
            })
            .catch(err => res.status(400).send(err))
    },

    /*
    @route    GET usercourse/userclasses?QUERY 
    QUERY     year
    QUERY     season
    QUERY     userId
    @desc     gets all the classes from userId with season & year as params
    */
    userClasses(req, res){
        const query = req.query
        userCourse.findAll({
            where: {userId: query.userid, season: query.season, year: query.year},
            attributes: ['courseId', 'classCode']
        })
            .then(results => {
                res.json(results)
            })
            .catch(err => res.status(400).send(err))
    }   
}


module.exports = uCourseController.uCourseRouter()