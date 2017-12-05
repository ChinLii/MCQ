var mongoose = require('mongoose');

var problem = mongoose.Schema({
    question: String,
    choices: [String],
    correctAnswer : String,
    topics : [String]
});

module.exports = mongoose.model('problem',problem);