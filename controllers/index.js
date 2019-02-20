const express = require('express')
const router = express.Router()

//controllers
const user = require('./user')
const Course = require('./course')
const Semester = require('./semester')

//routes
router.use('/user', user)
router.use('/class', Course)
router.use('/semester', Semester)

module.exports = router