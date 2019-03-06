const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const db = require('../config/database')

//Models
const User = db.User

function passwordsMatch(passwordSubmitted, storedPassword){
    return bcrypt.compareSync(passwordSubmitted, storedPassword)
}

passport.use(new LocalStrategy(
    {usernameField: 'username'}, (username, password, done) => {
        User.findOne({where: { username }})
            .then(user => {
                if(!user) return done(null,false)
                if(passwordsMatch(password, user.password) === false) return done(null, false)
                if(user) return done(null, user)
            })
            .catch(err => {return done(null, false)})
    }))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findByPk(id)
        .then(user => {
            if(!user) return done(null, false)
            return done(null, user)
        })
})

module.exports = passport