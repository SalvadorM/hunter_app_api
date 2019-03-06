const express = require('express')
const router = express.Router()

//controllers
const user = require('./user')
const course = require('./course')
const comment = require('./comment')
const post = require('./post')
const userCourse = require('./userCourse')

//routes
router.use('/user', user)
router.use('/class', course)
router.use('/usercourse', userCourse)
// router.use('/post', post)
router.use('/comment', comment)


module.exports = router