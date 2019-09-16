const express = require('express')
//init app
const app = express()
const server = require('http').Server(app)
const bodyParser = require('body-parser')
const sessions = require('express-session')
const passport = require('./middlewares/passportAuth')
const cors = require('cors')
const pg = require('pg')
const db = require('./config/database')
const SequelizeStore = require('connect-session-sequelize')(sessions.Store)
const io = module.exports.io = require('socket.io')(server)
const socketManager = require('./socketManager')

//session store 
const mySessionStore = new SequelizeStore({
  db: db.sequelize
})

mySessionStore.sync()

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
app.set('trust proxy', 1)

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
    store: mySessionStore,
    // // proxy: true,
    // cookie: {
    //   // secure: true,
    //   // httpOnly: false,
    //   // sameSite: false,
    //   domain: '.herokuapp.com'
    // }
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

