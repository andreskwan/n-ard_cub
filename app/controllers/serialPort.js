//--------------------------------------------
//Arduino
var arduinoSP  = "/dev/tty.usbmodem1411";

//--------------------------------------------
//Serial Port
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var serialPort = "";
var cleanData  = "";
var spBuffer   = "";

//--------------------------------------------
//JSON
var jsonData     = "";
var jsonDataObj = "";
var Validator = require('jsonschema').Validator;
var v = new Validator();

var serialportController = function (server){
  serialPort = new SerialPort(arduinoSP, {parser: serialport.parsers.readline("\n"),baudrate: 9600}, false); 

  //ToDO - distinguish from OS X and linux
  //require("serialport").list(function (err, ports) {
    serialport.list(function (err, ports) {
    //console.log('JSON.stringify(ports)): \n' + JSON.stringify(ports));
    ports.forEach(function(port) {
      console.log("--------------------------------------------");
      // console.log("port name:    "+port.comName);
      // console.log("pnpId:        "+port.pnpId);
      // console.log("manufacturer: "+port.manufacturer);

      if(port.manufacturer.trim() === "Arduino LLC"){
          console.log("Arduino - Disponible en el puerto -- "+ port.comName);
          console.log('JSON.stringify(port)): \n' + JSON.stringify(port));
      //     var thenum = port.comName.replace(/[^0-9]/g,'');
      //     console.log("theNum: "+thenum);
      //     console.log("before: "+arduinoSP);
      //     // var arraySplited = port.comName.split(".");
      //     this.arduinoSP = "/dev/tty.usbmodem"+thenum;
      // //     // console.log("############### "+arraySplited[1]+" ###############");
      //     // arduinoSP = port.comName;
      //     console.log("after: "+arduinoSP);

          // defPorts.resolve(puerto)
        }else{
          console.log("Arduino - no disponible en -- "+ port.comName);
        }
    });
  });

  serialPort.open(function (err) {
    // should not go further if not available 
    // defPorts.done(funcion ok
    if(err){
      console.log("Error -- Serial port Open event\n"+ err);
      //could validate port here?
      return;
    }
    console.log("############### "+" arduinoSP: "+this.arduinoSP+" ###############");
    console.log('open');

    serialPort.on('data', function(data) {
    	// spBuffer += data.toString();
      jsonDataObj = JSON.parse(data);
      if(v.validate(jsonDataObj, spSchema))
      {
          console.log('JSON.stringify(jsonDataObj)): \n' + JSON.stringify(jsonDataObj));
          // console.log('jsonDataObj.p2c:'+jsonDataObj.p1c);
          
      }
    });    
    // serialPort.write("9", function(err, results) {
    //   console.log('err ' + err);
    //   console.log('results ' + results);
    // });
  });
  server.io.route('serialData', function (req) {
              req.io.emit('hi', { message: 'Hi from server'});
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

server.io.route('serial', function (req) {
  req.io.emit('serialData', jsonDataObj);
});

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

server.post('/rise_speed', riseSpeedPost);

};
module.exports = serialportController;
