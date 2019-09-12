const express = require('express')
//init app
const app = express()
const server = require('http').Server(app)
const io = module.exports.io = require('socket.io')(server)
const socketManager = require('./socketManager')
const bodyParser = require('body-parser')
const sessions = require('express-session')
const passport = require('./middlewares/passportAuth')
const cors = require('cors')
const pg = require('pg')
const db = require('./config/database')


//heroku setting
const PORT = process.env.PORT || 8000
pg.defaults.ssl = true



//middlewares
const whitelist = [
    'http://localhost:3000',
    'https://classhub-hunter.herokuapp.com',
    'http://classhub-hunter.herokuapp.com',
    '192.168.1.4:3000'
  ];
//middlewares
app.use(
    cors({
        origin: function(origin, callback) {
          if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true
      })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))  
app.use(sessions({
    secret: 'YOO YUUR',
    resave: false, //required
    saveUninitialized: false,
    cookie: { httpOnly: false }

}))
app.use(passport.initialize())
app.use(passport.session())




const controllers = require('./controllers')
app.use(controllers)

io.on('connection', socketManager)

const resetDatabase = false

db.sequelize.sync({force: resetDatabase}).then(() => {
    server.listen(PORT, () => console.log(`app listening on port ${PORT}!`))
}) 

