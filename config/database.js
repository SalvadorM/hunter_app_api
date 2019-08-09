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
db.Comment = require('../models/Comment')(sequelize, Sequelize)
db.Post = require('../models/Post')(sequelize, Sequelize)
db.Friendship = require('../models/Friendship')(sequelize, Sequelize)
db.Message = require('../models/Message')(sequelize, Sequelize)
db.ChatRoom = require('../models/ChatRoom')(sequelize, Sequelize)


//relations
// N:M relation between user and course using userCourse table join
db.User.belongsToMany(db.Course, { through: db.userCourse,  foreignKey: 'userId'})
db.Course.belongsToMany(db.User, { through: db.userCourse,  foreignKey: 'classCode'})
db.userCourse.belongsTo(db.User)
db.userCourse.belongsTo(db.Course)

// 1:M relation between user and post
db.User.hasMany(db.Post)
db.Post.belongsTo(db.User)

// 1:M relation between post and comment 
db.Post.hasMany(db.Comment)
db.Comment.belongsTo(db.Post)

//N:M relation between 
db.Course.hasMany(db.Post ,{ foreignKey: 'classCode'})
db.Post.belongsTo(db.Course, { foreignKey: 'classCode'})

//1:M relation between post and comment 
db.Post.hasMany(db.Comment)
db.Comment.belongsTo(db.Post)

//1:M relation between user and comment 
db.User.hasMany(db.Comment)
db.Comment.belongsTo(db.User)

db.User.belongsToMany(db.User, { as: 'Friends', through: 'friends' })
db.User.belongsToMany(db.User, { as: 'Relations', foreignKey: 'userId_1', otherKey: 'userId_2', through: db.Friendship})

db.Friendship.belongsTo(db.User,{ foreignKey: 'userId_1', targetKey: 'id'})
db.Friendship.belongsTo(db.User,{ foreignKey: 'userId_2', targetKey: 'id'})

//Chat Room 
db.ChatRoom.belongsTo(db.User, { foreignKey: 'chatMember', targetKey: 'id'})
db.ChatRoom.belongsToMany(db.Message, { through: 'chat'})
db.Message.belongsTo(db.User,{ foreignKey: 'actionUser', targetKey: 'id'})



module.exports = db