var mongoose = require('mongoose');

var topic = mongoose.Schema({
    title : String,
});

module.exports = mongoose.model('topic',topic);