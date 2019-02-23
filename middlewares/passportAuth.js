const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const db = require('../config/database')

