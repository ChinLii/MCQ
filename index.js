//import library
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var config = require('./config/database.js');
var bodyParser = require('body-parser');

//connect database
var promise = mongoose.connect(config.url, {
    useMongoClient: true,
    /* other options */
});

//set port to running server
var port = process.env.PORT || 3000;

//import router
var pages = require('./app/routers/pages');
var api = require('./app/routers/api');
//set path public to access asset file
app.use(express.static(__dirname+'/public'));

// get information from html forms
app.use(bodyParser()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set view using ejs template
app.set('view engine', 'ejs');

//define path map to router
app.use('/',pages);
app.use('/api/v1/',api);

//run app on the port 
app.listen(port);
console.log('The magic happens on port '+port);