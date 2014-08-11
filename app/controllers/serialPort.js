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
var v = new Validator();

var serialportController = function (server,serialport,SerialPort,arduinoSP){
  console.log("sp.js - arduinoSP: "+arduinoSP);
  serialPort = new SerialPort(arduinoSP, 
    {parser: serialport.parsers.readline("\n"),baudrate: 9600},false);   

  serialPort.open(function (err) {
    // should not go further if not available 
    // defPorts.done(funcion ok
    if(err){
      console.log("Error -- Serial port Open event\n"+ err);
      //could validate port here?
      return;
    }
    console.log("############### "+" arduinoSP: "+arduinoSP+" ###############");
    console.log('open');


    serialPort.on('data', function (data) {
      // console.log('on.data');
      // spBuffer += data.toString();
      // console.log(spBuffer);
      // if(spBuffer.indexOf('}') >= 0 && 
      //   spBuffer.indexOf('{') >=0)
      //   {
      //     cleanData = spBuffer.substring(spBuffer.indexOf('{') + 1,
      //       spBuffer.indexOf('#'));
      //     console.log("serial port clean data: \n"+ cleanData);
      //     server.io.emit('message',cleanData);
      //   }   

     //  if(err){
     //    console.log("Error -- Serial port Open event\n"+ err);
     //    //could validate port here?
     //    return;
     //  }
      console.log('pepo');
     // spBuffer += data.toString();
     try{
      jsonDataObj = JSON.parse(data, function (k, v) {
          console.log("k",k);
          console.log("v",v);
      });
      }
      catch(e){
        console.log(e);
        //tell me something is wrong
      } 
      //it's executed even if nothing bad happens
      //what if I close the sp until I need to read data again 
      finally{
        console.log("open resources must be closed here!!!");
        return;
      }
      // console.log("v.validate(jsonDataObj, spSchema)"+v.validate(jsonDataObj, spSchema));
      // if(v.validate(jsonDataObj, spSchema))
      // {
      //     console.log('JSON.stringify(jsonDataObj)): \n' + JSON.stringify(jsonDataObj));
      //     // console.log('jsonDataObj.p2c:'+jsonDataObj.p1c);
      // }
    });    
    // serialPort.write("9", function(err, results) {
    //   console.log('err ' + err);
    //   console.log('results ' + results);
    // });
  });

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

v.addSchema(spSchema, '/spData');

server.io.route('serialData', function (req) {
  req.io.emit('hi', { message: 'Hi from server'});
});

server.io.route('serial', function (req) {
  req.io.emit('serialData', jsonDataObj);
});

var readSerialData = function (){

}
var riseSpeedPost = function (req, res){
  console.log("se oprimio el boton");
  res.redirect('/');
  // debugger;
  serialPort.write(req.body.speed, function (err, results) {
      if(err){
        console.log('Serial Port Write error: \n' + err);
        return;
      }
      console.log('results ' + results);
    });
}

var riseGetSpeed = function (req, res){
  console.log("REST");
  //res.redirect('/');
  // debugger;
  serialPort.write(req.params.speed, function (err, results) {
      if(err){
        console.log('Serial Port Write error: \n' + err);
        return;
      }
      console.log('results ' + results);
    });
}

server.post('/rise_speed',       riseSpeedPost);
server.get('/rise_speed/:speed', riseGetSpeed);

};
module.exports = serialportController;
