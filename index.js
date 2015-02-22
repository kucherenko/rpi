var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
	io: new raspi()
});

board.on('ready', function() {

	var servo = new five.Servo('P1-11');
	servo.to(20);

	this.repl.inject({
		servo: servo
	});
});
