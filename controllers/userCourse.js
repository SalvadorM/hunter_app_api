const express = require('express')
const db = require('../config/database')
const Sequelize = require('sequelize')

const Op = Sequelize.Op

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
        userCourse.findAll({
            include: [
                {model: User, required: true, attributes: ['id','name', 'username']},
                {model: Course, where: {section: query.section}, attributes: []}
            ],
            attributes: { exclude: ['year','updatedAt', 'createdAt', 'season','courseId','classCode', 'userId']},
            where: { classCode: query.classcode,
                    season: query.season,
                    year: query.year,
                 },
        })
            .then(data => {

                res.json(data)
            })
            .catch(err => {res.status(400).send(err)})

    },

    /*
    @route    GET usercourse/userclasses?QUERY 
    QUERY     year
    QUERY     season
    @desc     gets all the classes from userId with season & year as params
    */
    userClasses(req, res){
        const userId = req.user.id
        const query = req.query

        userCourse.findAll({
            where: {userId, season: query.season, year: query.year},
            raw : true
        })
            .then(results => {
                const classCodes = results.map((val) => {
                    return val.classCode
                })
                if(results.length === 0){
                    res.json([])
                }else{
                    Course.findAll({
                        where: {classCode: {[Op.or]: classCodes},},
                        raw: true
                    })
                        .then(courses => {res.json(courses)})
                        .catch(err => res.status(400).send(err))
                }

            })
            .catch(err => res.status(400).send(err))
    }   
}


module.exports = uCourseController.uCourseRouter()