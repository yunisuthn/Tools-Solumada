const mongoose = require("mongoose")

const projet = mongoose.Schema({
    name: String
})

module.exports = mongoose.model('Projet', projet)