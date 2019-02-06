const express = require('express')
const router = express.Router()

//controller
const user = require('./user')

router.use('/user', user)

module.exports = router