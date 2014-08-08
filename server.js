//--------------------------------------------
//Serial Port
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var arduinoSP  = "arduion sp not defined";
//ToDO - distinguish from OS X and linux
  //require("serialport").list(function (err, ports) {
    serialport.list(function (err, ports) {
    //console.log('JSON.stringify(ports)): \n' + JSON.stringify(ports));
    ports.forEach(function(port) {
      console.log("--------------------------------------------");
       console.log("port name:    "+port.comName);
       console.log("pnpId:        "+port.pnpId);
       console.log("manufacturer: "+port.manufacturer);

      if(port.manufacturer === "Arduino LLC" ||
         port.pnpId === "usb-Arduino_LLC_Arduino_Leonardo-if00"){
          console.log("Arduino - Disponible en el puerto -- "+ port.comName);
          console.log('JSON.stringify(port)): \n' + JSON.stringify(port));
      //     var thenum = port.comName.replace(/[^0-9]/g,'');
      //     console.log("theNum: "+thenum);
          console.log("before: "+arduinoSP);
      //     // var arraySplited = port.comName.split(".");
      //     this.arduinoSP = "/dev/tty.usbmodem"+thenum;
      // //     // console.log("############### "+arraySplited[1]+" ###############");
      	  arduinoSP = port.comName;
      	  console.log("after: "+arduinoSP);
          // defPorts.resolve(puerto)
          //--------------------------------------------
		//sp module
		var serialPortController = require('./app/controllers/serialPort.js');
			console.log("server - arduinoSP: "+arduinoSP);
			serialPortController(server,serialport,SerialPort,arduinoSP);
        }else{
	        console.log("Arduino - no disponible en -- "+ port.comName);
        }
    });
  });

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
//load static files
server.use(express.static('./public'));

// //--------------------------------------------
// //sp module
// var serialPortController = require('./app/controllers/serialPort.js');
// console.log("server - arduinoSP: "+arduinoSP);
// serialPortController(server,SerialPort,arduinoSP);

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

server.use(function (req,res) {
    res.render('404', {url:req.url});
});

  
server.listen(3000);
