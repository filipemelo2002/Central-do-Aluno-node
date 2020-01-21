'use strict'

const mongoose = require('mongoose')

const User = mongoose.Schema({
    email: String,
    senha: String,
    userToken: String
})

module.exports = mongoose.model('usuarios', User)
