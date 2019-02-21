const express = require('express')
const router = express.Router()

//controllers
const user = require('./user')
const Course = require('./course')
const userCourse = require('./userCourse')

//routes
router.use('/user', user)
router.use('/class', Course)
router.use('/usercourse', userCourse)


module.exports = router