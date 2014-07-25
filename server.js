// var arduinoSP  = "/dev/tty.";///dev/tty.usbmodem1421";
var arduinoSP  = "/dev/tty.usbmodem1411";
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var jsonData     = "";
var jsonDataObj = "";
var Validator = require('jsonschema').Validator;
var v = new Validator();
var serialPort = "";

var io = require('socket.io').listen(8000);

io.sockets.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log("msg" + msg);
      });
    socket.on('disconnect', function () {
        console.log("disconnect");
      });
});

  //ToDO - distinguish from OS X and linux
  //require("serialport").list(function (err, ports) {
    serialport.list(function (err, ports) {
    console.log('JSON.stringify(ports)): \n' + JSON.stringify(ports));
    ports.forEach(function(port) {
      console.log("--------------------------------------------");
      console.log("port name:    "+port.comName);
      console.log("pnpId:        "+port.pnpId);
      console.log("manufacturer: "+port.manufacturer);

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
          
        }
    });
  });
  serialPort = new SerialPort(arduinoSP, {parser: serialport.parsers.readline("\n"),baudrate: 9600}, false); 
  // console.log("############### "+" arduinoSP: "+this.arduinoSP+" ###############");
    // var serialPort = new SerialPort(arduinoSP, {parser: serialport.parsers.readline("\n"),baudrate: 9600}, false); 
  // {"p1o":"1", "p1c":"0", "p2o":" 100 ", "celsius2":" 100 "}
  // to create 
  // "{'p1o':'1', 'p1c':'0', 'p2o':'100', 'celsius2':'100'}"
  // jsonData = "{'p1o':'1', 'p1c':'0', 'p2o':'100', 'celsius2':'100'}";
  // /jsonData = ;
  // debugger;
  // var jsonStr = '{"p1o":"1","p1c":"0","p2o":"100","p2c":"100"}';

  serialPort.open(function () {
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
  
//   function tryParseJSON (jsonString){
//     try {
//         var o = JSON.parse(jsonString);
//         // Handle non-exception-throwing cases:
//         // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
//         // but... JSON.parse(null) returns 'null', and typeof null === "object", 
//         // so we must check for that, too.
//         if (o && typeof o === "object" && o !== null) {
//             return o;
//         }
//     }
//     catch (e) { 
//     return false;
// };
// arduinoSP not changed globally? 
//console.log("arduinoSP: "+arduinoSP);
var httpModule = require('http');
var server     = httpModule.createServer(function (req,res){
  console.log(req.headers);
  res.writeHead(200,{'Content-Type': 'text/html'});
  // debugger;
  res.end(JSON.stringify(jsonDataObj));
}).listen(3000);