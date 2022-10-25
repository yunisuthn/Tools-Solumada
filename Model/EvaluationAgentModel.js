const mongoose = require('mongoose')

const evaluationAgent = mongoose.Schema({
    usualName: String, 
    mcode: String,
    production: String,
    quality: String,
    comportement: String,
    // level: String
})
 
module.exports = mongoose.model('EvaluationAgent', evaluationAgent)