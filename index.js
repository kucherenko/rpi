var raspi = require('raspi-io');
var five = require('johnny-five');
var express = require('express');
var serveStatic = require('serve-static');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


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


app.use(serveStatic(__dirname, {
  'index': ['index.html'],
  'extensions': ['html', 'js']
}))

server.listen(8081);

io.on('connection', function(socket) {
  socket.emit('news', {
    hello: 'world'
  });
  socket.on('my other event', function(data) {
    console.log(data);
  });
});
