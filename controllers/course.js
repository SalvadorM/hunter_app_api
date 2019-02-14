const express = require('express')
const db = require('../config/database')

//class model 
const Course = db.Course


const classController = {
    classRouter(){
        const router = express.Router()

        //routes for class model 
        router.get('/find/:id', this.getClassById)
        router.post('/add', this.addClass)
        return router
    },

    //@route    GET /find/:id
    //@params   id
    //@desc     Get class information by id from database
    getClassById(req, res){
        const classId = req.params.id
        Class.findByPk(classId)
            .then(classFound => {
                res.json(classFound)
            })
            .catch(err => res.status(400).json(err))
    },

    //@route    POST /add
    //@desc     POST a class to database
    addClass(req, res){
        const classCode = req.body.classCode 
        const className = req.body.className
        const section = req.body.section 
        const information = req.body.information 

        Course.create({classCode, className, section, information})
            .then(addedClass => {
                res.json(addedClass)
            })
            .catch(err => res.status(400).send(err))
    }
}

module.exports = classController.classRouter()