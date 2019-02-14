const express = require('express')
const router = express.Router()

//controllers
const user = require('./user')
const Course = require('./course')

//routes
router.use('/user', user)
router.use('/class', Course)

module.exports = router