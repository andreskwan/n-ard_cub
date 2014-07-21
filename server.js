// var arduinoSP  = "/dev/tty.";///dev/tty.usbmodem1421";
var arduinoSP  = "/dev/tty.usbmodem1421";
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var jsonData = "";
  
  function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
};

  require("serialport").list(function (err, ports) {
    ports.forEach(function(port) {
      console.log("--------------------------------------------");
      console.log("port name:    "+port.comName);
      console.log("pnpId:        "+port.pnpId);
      console.log("manufacturer: "+port.manufacturer);
      // if(port.manufacturer.trim() === "Arduino LLC"){
      //     // var thenum = port.comName.replace(/[^0-9]/g,'');
      //     var arraySplited = port.comName.split(".");
      //     arduinoSP += arraySplited[1].trim();
      //     // console.log("############### "+arraySplited[1]+" ###############");
      //     // arduinoSP = port.comName;
      //     console.log(arduinoSP);
      //   }
    });
  });

  var serialPort = new SerialPort(arduinoSP, {
    parser: serialport.parsers.readline("\n"),
      baudrate: 9600
  }, false); 
//{"p1o":"1", "p1c":"0", "p2o":" 100 ", "celsius2":" 100 "}
// "{'p1o':'1', 'p1c':'0', 'p2o':'100', 'celsius2':'100'}"
  serialPort.open(function () {
    console.log('open');
    serialPort.on('data', function(data) {
      // jsonData = "{'p1o':'1', 'p1c':'0', 'p2o':'100', 'celsius2':'100'}";
      // /jsonData = ;
      // debugger;
      console.log('data received: \n' + data);
      console.log('jsonData.celsius:'+jsonData.celsius);
      // serialPort.pause();
    });
  });


// var httpModule = require('http');
// var server     = httpModule.createServer(function (req,res){
//   // console.log(req.headers);
//   res.writeHead(200,{'Content-Type': 'text/html'});
//   // debugger;
//   res.end(jsonData);
// }).listen(3000);