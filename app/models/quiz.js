var mongoose = require('mongoose');

var quiz = mongoose.Schema({
    title: String,
    problemsId : [String],
});

module.exports = mongoose.model('quiz',quiz);