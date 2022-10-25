const mongoose = require("mongoose");

const plan = mongoose.Schema({
    shift : String,
    mcode: String,
    usualName: String,
    project: String,
    start: Date,
    end: Date
})


module.exports = mongoose.model('Planning', plan)
