const mongoose = require('mongoose')

const User = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mcode: String,
    typeUtil: String,
})

module.exports = mongoose.model('user', User)