const express = require('express')
const bodyParser = require('body-parser')
const sessions = require('express-session')
const passport = require('./middlewares/passportAuth')
const cors = require('cors')
const pg = require('pg')
const db = require('./config/database')


//heroku setting
const PORT = process.env.PORT || 8000
pg.defaults.ssl = true

//init app
const app = express()

//middlewares
const dev = ['http://localhost:3000', 'https://classhub-hunter.herokuapp.com/']
const prod = 'https://classhub-hunter.herokuapp.com'
const corsOptions = {
    origin: '*',
    credentials: true,
}  
//middlewares
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))  
app.use(sessions({
    secret: 'YOO YUUR',
    resave: false, //required
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())




const controllers = require('./controllers')
app.use(controllers)



db.sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log(`app listening on port ${PORT}!`))
})