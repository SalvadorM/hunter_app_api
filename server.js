const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const pg = require('pg')
const db = require('./config/database')

//heroku setting
const PORT = 8000 || process.env.PORT
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


db.sequelize.sync({force: true}).then(() => {
    app.listen(PORT, () => console.log(`app listening on port ${PORT}!`))
})