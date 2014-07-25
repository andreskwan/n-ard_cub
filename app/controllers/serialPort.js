//--------------------------------------------
//Arduino
var arduinoSP  = "/dev/tty.usbmodem1411";

//--------------------------------------------
//Serial Port
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var serialPort = "";

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
        console.log('JSON.stringify(port)): \n' + JSON.stringify(port));
          var thenum = port.comName.replace(/[^0-9]/g,'');
          console.log("theNum: "+thenum);
          console.log("before: "+arduinoSP);
          // var arraySplited = port.comName.split(".");
          this.arduinoSP = "/dev/tty.usbmodem"+thenum;
      //     // console.log("############### "+arraySplited[1]+" ###############");
          // arduinoSP = port.comName;
          console.log("after: "+arduinoSP);
          
        }else{
          console.log("Arduino - no disponible en -- "+ port.comName);
        }
    });
  });

  serialPort.open(function (err) {
    //should not go further if not available 
    if(err){
      console.log("Error -- Serial port Open event\n"+ err);
      //could validate port here?
      return;
    }
    console.log("############### "+" arduinoSP: "+this.arduinoSP+" ###############");
    console.log('open');

    serialPort.on('data', function(data) {
      jsonDataObj = JSON.parse(data);
      console.log('validate json schema ' + v.validate(jsonDataObj, spSchema));
      console.log('JSON.stringify(jsonDataObj)): \n' + JSON.stringify(jsonDataObj));
      console.log('jsonDataObj.p2c:'+jsonDataObj.p1c);
      console.log('jsonDataObj.p2o:'+jsonDataObj.p1o);
      console.log('jsonDataObj.p2c:'+jsonDataObj.p2c);
      console.log('jsonDataObj.p2o:'+jsonDataObj.p2o);
      // JSON.parse(jsonDataObj, function (k,v){
      //   console.log("key: "+k+" value: "+v);
      //   return v;
      // });
      // serialPort.pause();
    });
    
    serialPort.write("1", function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });

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

};
module.exports = serialportController;
