//--------------------------------------------
//server express.io
var express = require('express.io');
var server  = express();

//--------------------------------------------
//html template
var swig = require('swig');
//js array manipulation easy
// var _ = require('underscore');

//--------------------------------------------
//enable template engine
server.engine('html',swig.renderFile);
server.set('view engine', 'html');
server.set('views','./app/views/');

//--------------------------------------------
//server configuration
//allow socket.io
server.http().io();
//
server.configure(function() {
    //Para usar metodos de HTTP
    server.use(express.bodyParser());
});

//--------------------------------------------
//load static files
server.use(express.static('./public'));


//--------------------------------------------
//server
server.get('/', function (req, res) {
    res.render('home');
});

// //--------------------------------------------
// //sp module
var serialPortController = require('./app/controllers/serialPort.js');
// console.log("server - arduinoSP: "+arduinoSP);
serialPortController(server);


server.use(function (req,res) {
    res.render('404', {url:req.url});
});


server.listen(3000);
