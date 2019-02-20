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
        return router
    },

    //@route    GET /find/:id
    //@params   id
    //@desc     Get class information by id from database
    getCourseById(req, res){
        const classId = req.params.id
        Course.findByPk(classId)
            .then(course => {
                res.json(course)
            })
            .catch(err => res.status(400).json(err))
    },

    //@route    POST /add
    //@desc     POST a class to database
    addCourse(req, res){
        const classCode = req.body.classCode 
        const className = req.body.className
        const section = req.body.section 
        const information = req.body.information 
        // after user auth userId = req.user.id
        const userId = req.body.userId
        const semesterId = req.body.semester

        Course.create({classCode, className, section, information, userId, semesterId})
            .then(addedClass => {
                res.json(addedClass)
            })
            .catch(err => res.status(400).send(err))
    }
}

module.exports = courseController.courseRouter()