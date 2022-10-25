const mongoose = require('mongoose')

const Instruction = mongoose.Schema({
    name: String,
    title: String,
    instruction: String
})

module.exports = mongoose.model('Instruction', Instruction)