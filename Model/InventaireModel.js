const mongoose = require('mongoose')

const Inventaire = mongoose.Schema({
    name: String,
    code: String,
    nombre: String
})

module.exports = mongoose.model('Inventaire', Inventaire)