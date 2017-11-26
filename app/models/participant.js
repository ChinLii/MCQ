var mongoose = require('mongoose');

var participant = mongoose.Schema({
    quizId: String,
    answerList: [String],
    score : Number
});

module.exports = mongoose.model('participant',participant);