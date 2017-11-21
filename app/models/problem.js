var mongoose = require('mongoose');

var problem = mongoose.Schema({
    quizId: String,
    question: String,
    choices: [String],
    correctAnswer : String,
});

module.exports = mongoose.model('problem',problem);