const express = require('express')
const router = express.Router()

//controller
const user = require('./user')

app.use('/user', user)

module.export = router