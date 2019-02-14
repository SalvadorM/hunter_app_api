const express = require('express')
const router = express.Router()

//controllers
const user = require('./user')
const Class = require('./course')


//routes
router.use('/user', user)
router.use('/class', Class)

module.exports = router