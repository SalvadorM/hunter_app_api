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
                        course.addUsers(user, {through: {year, season, classCode}}) 
                            .then(test => {
                               res.json(test)
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
        const courseId = req.params.id
        Course.destroy({where: {id: courseId}})
            .then(()=> {
                res.json({
                    message: `Course ${courseId} has been deleted`
                })
            })
            .catch(err => res.status(400).send(err))
    },
}

module.exports = courseController.courseRouter()