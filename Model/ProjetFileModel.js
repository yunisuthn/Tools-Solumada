const mongoose = require('mongoose')

const fileProjet = mongoose.Schema({
    nameProjet: String,
    nameFile: String
})

module.exports = mongoose.model('ProjetFile', fileProjet)