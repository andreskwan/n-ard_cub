var serialPort = require("serialport");

//how to assign to a var a reuse the function
serialPort.list(function (err, ports) {
  ports.forEach(function(port) {
  	console.log("--------------------------------------------");
    console.log("port name:    "+port.comName);
    console.log("pnpId:        "+port.pnpId);
    console.log("manufacturer: "+port.manufacturer);
  });
});