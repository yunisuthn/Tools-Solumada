const mongoose = require('mongoose')

const agent = mongoose.Schema({
    name: String,
    usualName: String, 
    mcode: String,
    number: String,
    shift: String,
    project: String,
    site: String,
    quartier: String,
    tel: String
    // level: String
})
 
module.exports = mongoose.model('Agent', agent)