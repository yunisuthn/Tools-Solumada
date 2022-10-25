const mongoose = require('mongoose')

const TL = mongoose.Schema({
    name: String, 
    mcode: String,
    strengths: String,
    weaknesses: String,
    opportunities: String,
    threats: String,
})
 
module.exports = mongoose.model('TeamLeader', TL)