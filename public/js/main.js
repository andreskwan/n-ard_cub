$(document).ready(function () {
	//connect to the server
	window.io = io.connect();

	//on connection
	io.on('connect', function (socket){
		console.log('connected with the server');
		io.emit('ready');
	});
	io.on('hi', function (data){
		debugger;
		console.log('Data: \n' + data);
	});
	io.on('serialData', function (data){
		debugger;
		// console.log('JSON.stringify(jsonDataObj)): \n' + JSON.stringify(data));
	});
	io.emit('serial');
	
});