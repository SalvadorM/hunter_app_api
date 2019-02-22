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
db.userCourse = require('../models/userCourse')(sequelize, Sequelize)


//relations
db.User.belongsToMany(db.Course, { through: db.userCourse,  foreignKey: 'userId'})
db.Course.belongsToMany(db.User, { through: db.userCourse,  foreignKey: 'classCode'})


module.exports = db

