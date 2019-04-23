const express = require('express')
const db = require('../config/database')

//class model 
const Course = db.Course
const User = db.User



const courseController = {
    courseRouter(){
        const router = express.Router()

        //routes for class model 
        router.get('/find/:id', this.getCourseById)
        router.get('/findclass/:classcode', this.findCourseByClassCode)
        router.post('/add', this.addCourse)
        router.delete('/delete/:id', this.deleteCourse)
        return router
    },
    //@route    GET /find/:id
    //@params   id
    //@desc     Get class information by id from database
    getCourseById(req, res){
        const classId = req.params.id
        Course.findByPk(classId)
            .then(course => {res.json(course)})
            .catch(err => res.status(400).json(err))
    },

    //@route    GET /findclass/:classcode
    //@params   classcode
    //@desc     Get class information by id from database
    findCourseByClassCode(req, res){
        const classCode = req.params.classcode
        Course.findAll({where: {classCode}})
            .then(course => {
                res.json(course)
            })
            .catch(err => {res.status(400).send(err)})
    
    },

    //@route    POST /add
    //@desc     POST a class to database
    addCourse(req, res){
        const classCode = req.body.classCode 
        const className = req.body.className
        const section = req.body.section 
        const information = req.body.information 
        const userId = req.user.id

        //userCourse 
        const season = req.body.season
        const year = req.body.year
        Course.findOrCreate({where: {classCode,section}, defaults: {className, information, userId}})
            .spread((course, created)=> {
                //find user to associate
                User.findByPk(userId)
                    .then(user => {
                        //user / course 
                        console.log(course)
                        course.addUsers(user, {through: {year, season, classCode, courseClassCode: classCode}}) 
                            .then(responce => {
                                console.log(responce)
                               res.json(course)
                            })
                            .catch(err => res.status(400).send(err))
                    }) 
                    .catch(err => res.status(400).send(err))
            })
            .catch(err => res.status(400).send(err))
    },

    //@route    DELETE /delete/:id
    //@params   id
    //@desc     delete a course record from database
    deleteCourse(req, res){
        const classCode = req.params.id
        const userId = req.user.id
        if(userId) {
            Course.destroy({where: {classCode}})
            .then(()=> {
                res.json({
                    message: `Course ${classCode} has been deleted`
                })
            })
            .catch(err => res.status(400).send(err))   
        }
    },

}

module.exports = courseController.courseRouter()