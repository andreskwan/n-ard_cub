//--------------------------------------------
//html template
var swig = require('swig');
//js array manipulation easy
// var _ = require('underscore');


//--------------------------------------------
//server express.io
var express = require('express.io');
var server  = express();


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
//sp module
var serialPortController = require('./app/controllers/serialPort.js');
serialPortController(server);

//--------------------------------------------
//server
server.get('/', function (req, res) {
  res.render('home');
});

// var io = require('socket.io').listen(8000);

// io.sockets.on('connection', function (socket) {
//     socket.on('message', function (msg) {
//         console.log("msg" + msg);
//       });
//     socket.on('disconnect', function () {
//         console.log("disconnect");
//       });
// });


  
server.listen(3000);