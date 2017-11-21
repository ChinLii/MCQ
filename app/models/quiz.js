var mongoose = require('mongoose');

var quiz = mongoose.Schema({
    name: String,
});

module.exports = mongoose.model('quiz',quiz);