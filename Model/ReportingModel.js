const mongoose = require("mongoose");

const reporting = mongoose.Schema({
    mcode: String,
    name: String,
    production: String,
    faute: String,
    start: Date,
    end: Date
})

module.exports = mongoose.model('Reporting', reporting)