var Q = require('q');

function one(arg) {
    
    var deferred = Q.defer(); // Don't worry yet what this is until after you understand the flow
    
    console.log("Starting one's ajax with arg: " + arg);
    console.log('Finished with one. Ready to call next.');
    deferred.resolve("This is one's result"); // The deferred object has a "promise" member, which has a "then" function
    return deferred.promise;
}
 
function two(arg) {
    var deferred = Q.defer();
    console.log("Starting two's ajax with arg: " + arg);
    console.log('Finished with two. Ready to call next.');
    deferred.resolve("This is two's result");
    return deferred.promise;
}
 
function three(arg) {
    var deferred = Q.defer();
    console.log("Starting three's ajax with arg: " + arg);
    console.log('Finished with three. Ready to call next if there is one.');
    deferred.resolve("This is three's result");
    return deferred.promise;
}
 
function four(arg) {
    console.log("Starting four with arg: " + arg);
    console.log("Finished synchronous four");
}

one("arg given to one").then(two).then(three).then(four);

// > one("arg given to one").then(two).then(three).then(four);
// Starting one's ajax with arg: arg given to one
// Finished with one. Ready to call next.
// [object Object]
// > Starting two's ajax with arg: This is one's result
// Finished with two. Ready to call next.
// Starting three's ajax with arg: This is two's result
// Finished with three. Ready to call next if there is one.
// Starting four with arg: This is three's result
// Finished synchronous four



function one(){
    var deferred = Q.defer();
    serialport.list(function (err, ports) {
        // console.log('JSON.stringify(ports)): \n', ports);//JSON.stringify(ports));
        deferred.resolve(ports);
    });
    return deferred.promise;
}

var identifyPortName = function(ports){
  var deferred = Q.defer();
// //ToDO - distinguish from OS X and linux
// //require("serialport").list(function (err, ports) {
// // async.waterfall([
    // console.log('JSON.stringify(ports)): \n' + JSON.stringify(ports));
    // console.log('identifyPortName \n',ports);
    ports.forEach(function(port) {
    // console.log("--------------------------------------------");
    // console.log("port name:    "+port.comName);
    // console.log("pnpId:        "+port.pnpId);
    // console.log("manufacturer: "+port.manufacturer);
  // });
    if(port.manufacturer.trim() === "Arduino LLC" ||
            port.pnpId === "usb-Arduino_LLC_Arduino_Leonardo-if00"){
            console.log("Arduino - Disponible en el puerto -- "+ port.comName);
            console.log('Arduino JSON: \n',port);
        //     var thenum = port.comName.replace(/[^0-9]/g,'');
        //     console.log("theNum: "+thenum);
            console.log("before: "+arduinoSP);
        //     // var arraySplited = port.comName.split(".");
        //     this.arduinoSP = "/dev/tty.usbmodem"+thenum;
        // //     // console.log("############### "+arraySplited[1]+" ###############");
            arduinoSP = port.comName;
            deferred.resolve(arduinoSP);
            console.log("after: "+arduinoSP);
            // defPorts.resolve(puerto)
            //--------------------------------------------
        }else{
            console.log("Arduino - no disponible en -- "+ port.comName);
        }
    });
  return deferred.promise;
};

var createSerialPort = function(portName){
  //sp module
  // var serialPortController = require('./app/controllers/serialPort.js');
  // console.log("server - arduinoSP: "+arduinoSP);
  // serialPortController(server,serialport,SerialPort,arduinoSP);
};

var onError = function(err){
  console.log(err.message);
};

// defer.promise
// .then(
// }), onError)
// .then(function identifyPortName (ports){
//   console.log('JSON ports: \n', ports);
// },onError).done();
one().then(identifyPortName);
// .then(createSerialPort(portName),onError)
