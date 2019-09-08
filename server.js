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
// const dev = 'http://localhost:3000'
// const native_server = 'http://localhost:3000'
let prod = 'https://classhub-hunter.herokuapp.com'
const corsOptions = {
    origin: prod,
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

io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });

io.on('connection', socketManager)

const resetDatabase = false

db.sequelize.sync({force: resetDatabase}).then(() => {
    server.listen(PORT, () => console.log(`app listening on port ${PORT}!`))
}) 

