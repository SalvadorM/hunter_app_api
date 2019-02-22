const express = require('express')
const bodyParser = require('body-parser')
const sessions = require('express-session')
const cors = require('cors')
const pg = require('pg')
const db = require('./config/database')


//heroku setting
const PORT = process.env.PORT || 8000
pg.defaults.ssl = true

//init app
const app = express()

//middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//controllers
const controllers = require('./controllers')
app.use(controllers)


db.sequelize.sync({force:true}).then(() => {
    app.listen(PORT, () => console.log(`app listening on port ${PORT}!`))
})