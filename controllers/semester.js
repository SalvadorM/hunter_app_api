const express = require('express')
const db = require('../config/database')


//models 
const Semester = db.Semester

const semesterController = {
    semesterRouter(){
        const router = express.Router()

        router.post('/create', this.createSemester)
        router.delete('/delete/:id', this.deleteSemester)

        return router 
    },
    //@route    POST semester/create
    //@desc     create new semester in database
    createSemester(req, res){
        const {year, season} = req.body
        console.log(year, season)
        Semester.create({year, seasons})
            .then(semester => {
                res.json(semester)
            })
            .catch(err => res.status(400).send(err))
        // res.json({year, season})
    },

    //@route    DELETE semester/delete/:id
    //@params   id
    //@desc     delete a user semester from database
    deleteSemester(req, res){

    },  
}


module.exports = semesterController.semesterRouter()