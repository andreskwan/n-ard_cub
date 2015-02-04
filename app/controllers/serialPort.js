//--------------------------------------------
//Serial Port
var serialport = require("serialport");
//  ™
var SerialPort = serialport.SerialPort;
var async      = require('async');

var arduinoSP  = "arduio sp not defined";
//promises to handle serialPort
var Q          = require('q');

//--------------------------------------------
//Arduino
// var arduinoSP  = "/dev/tty.usbmodem1411";

//--------------------------------------------
//Serial Port
// var serialport = require("serialport");
// var SerialPort = serialport.SerialPort;
var serialPort = "";
var cleanData  = "";
var spBuffer   = "";

//--------------------------------------------
//JSON
var jsonData     = "";
var jsonDataObj = "";
var Validator = require('jsonschema').Validator;
var validator = new Validator();

var serialportController = function (server){

  var identifyPorts = function (){
      var deferred = Q.defer();
      serialport.list(function (err, ports) {
          deferred.resolve(ports);
      });
      return deferred.promise;
  }
  var identifyArduinoPort = function (ports){
    var deferred = Q.defer();
      ports.forEach(function(port) {
      if(port.manufacturer.trim() === "Arduino LLC" ||
              port.pnpId === "usb-Arduino_LLC_Arduino_Leonardo-if00"){
              console.log('Arduino JSON: \n',port);
              console.log("before: "+arduinoSP);
              arduinoSP = port.comName;
              console.log("after: "+arduinoSP);
              deferred.resolve(arduinoSP);
          }else{
              // console.log("Arduino - no disponible en -- "+ port.comName);
          }
      });
    return deferred.promise;
  };
  var createSerialPort = function(portName){
    var deferred = Q.defer();
    console.log("sp.js - arduinoSP: "+portName);
    serialPort = new SerialPort(arduinoSP, 
                        { parser: serialport.parsers.readline("\n"),
                          baudrate: 9600},
                                false);
    deferred.resolve(serialPort);
    return deferred.promise;
  };
  var openSerialPort = function(serialPort){
    serialPort.open(function (err) {
      if(err){
        console.log("Error -- Serial port Open event\n"+ err);
        //could validate port here?
        return;
      } 
    });
  };

  identifyPorts()
  .then(identifyArduinoPort)
  .then(createSerialPort)
  .then(openSerialPort);

var spSchema = 
{
  "id"  : "/spData",
  "type": "object",
  "properties": {
    "p1o" : {"type": "string", "minimum": 1},
    "p1c" : {"type": "string", "minimum": 1},
    "p2o" : {"type": "string", "minimum": 1},
    "p2c" : {"type": "string", "minimum": 1},
  },
};

validator.addSchema(spSchema, '/spData');

//socketIO integration 
// server.io.route('serialData', function (req) {
//   req.io.emit('hi', { message: 'Hi from server'});
// });

// server.io.route('serial', function (req) {
//   req.io.emit('serialData', jsonDataObj);
// });

// var readSerialData = function (){
// }

var riseSpeedPost = function (req, res){
  console.log("se oprimio el boton");
  // res.redirect('/');
  // debugger;
  serialPort.write("{"+req.body.speed+"}", function (err, results) {
      if(err){
        console.log('Serial Port Write error: \n' + err);
        return;
      }
      console.log('results req.body.speed',req.body.speed);
    });
}

var riseGetSpeed = function (req, res){
  console.log("REST");
  //res.redirect('/');
  // debugger;
  serialPort.write("{"+req.params.speed+"}", function (err, results) {
      if(err){
        console.log('Serial Port Write error: \n' + err);
        return;
      }
      console.log('results req.params.speed' + results);
  });
}

var getServerStatus = function (req, res){
  //is server listening, on?
  //is serial port working?
  //is arduino connected?
  //this could also turn on arduino
  //should this function splited 
}

//json  define keys and values
//key open   value 1 yes, 0 no
//key close
var postSPOrder = function (req, res) {
//conditional to identify the order inside the JSON 
}

var updateCubiertaState = function (req, res) {
  console.log("update cubierta state: "+ req.params.order);
  switch (req.params.order){
    case "open":
        console.log("open cubierta");
        break;
    case "close":
        console.log("close cubierta");
        break;    
    default:
        console.log("not valid command");
  }     

  serialPort.write(req.params.speed, function (err, results) {
          if(err){
            console.log('Serial Port Write error: \n' + err);
            // serialPort.close();
            return;
          }
          console.log('write results ' + results);
  });   
}

//post    create 
//get     read   find
//put     update 
//delete  delete 
server.get('/cubierta/',       getServerStatus);
server.post('/cubierta/',      postSPOrder);
server.put('/cubierta/:order',  updateCubiertaState);

server.get('/rise_speed/:speed', riseGetSpeed);
server.post('/rise_speed',       riseSpeedPost);

};
module.exports = serialportController;
