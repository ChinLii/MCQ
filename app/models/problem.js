var mongoose = require('mongoose');

var problem = mongoose.Schema({
    question: String,
    choices: [String],
    correctAnswer : String,
    topics : [String],
    numberOfTaken : {
        type : Number,
        default : 0
    } ,
    numberOfCorrect : {
        type : Number,
        default : 0
    },
});

module.exports = mongoose.model('problem',problem);