var sensorLib = require('node-dht-sensor');
var raspi = require('raspi-io');
var five = require('johnny-five');

var express = require('express');
var serveStatic = require('serve-static');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);

var servo, sensor;

var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {
  servo = new five.Servo('P1-12');
  servo.to(10);
});

app.use(serveStatic(__dirname, {
  'index': ['index.html'],
  'extensions': ['html', 'js']
}))
server.listen(8081);

io.on('connection', function(socket) {

  socket.on('start.servo', function() {
    servo.to(110);
    setTimeout(function() {
      servo.to(10);
    }, 1000);
  });

  sensor = {
    initialize: function() {
      return sensorLib.initialize(22, 4);
    },
    read: function() {
      var readout = sensorLib.read();
      console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
        'humidity: ' + readout.humidity.toFixed(2) + '%');

      socket.emit('data.update', {
        temp: readout.temperature.toFixed(2),
        hum: readout.humidity.toFixed(2)
      });
      setTimeout(function() {
        sensor.read();
      }, 1000);
    }
  };
  if (sensor.initialize()) {
    sensor.read();
  } else {
    console.warn('Failed to initialize sensor');
  }
});
