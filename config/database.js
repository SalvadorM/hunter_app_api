const Sequelize = require('sequelize')
const env = require('./env')

//sequelize and heroku config
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    operatorsAliases: false,
   
    pool: {
      max: env.max,
      min: env.pool.min,
      acquire: env.pool.acquire,
      idle: env.pool.idle
    }
})


const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

//models 
db.User = require('../models/User')(sequelize, Sequelize)
db.Course = require('../models/Course')(sequelize, Sequelize)
db.Semester = require('../models/Semester')(sequelize, Sequelize)


//relations
db.Course.belongsToMany(db.User, {through: 'userCourse'})
db.User.belongsToMany(db.Course, {through: 'userCourse'})

db.Course.belongsTo(db.Semester)
db.Semester.hasMany(db.Course)


module.exports = db

