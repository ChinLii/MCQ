var mongoose = require('mongoose');

var quiz = mongoose.Schema({
    title: String,
    numberOfQuestion: Number,
});

module.exports = mongoose.model('quiz',quiz);