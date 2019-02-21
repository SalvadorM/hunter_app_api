const express = require('express')
const db = require('../config/database')


//models 
const userCourse = db.userCourse

const uCourseController = {
    uCourseRouter(){
        const router = express.Router()

        router.get('/all', this.getAll)

        return router 
    },
    getAll(req, res) {
        userCourse.findAll()
            .then(courses => {
                res.json(courses)
            })  
            .catch(err => res.status(400).send(err))
    },
    
}


module.exports = uCourseController.uCourseRouter()