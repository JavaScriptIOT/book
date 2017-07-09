var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');
var io  = require('socket.io').listen(5000); //在5000端口启动socket.io服务
var client = new mqtt.MQTTClient(1883, 'test.mosquitto.org', 'pusher');
//启动MQTT客户端接受消息 
io.sockets.on('connection', function (socket) { //当浏览器尝试链接时处理消息
  socket.on('subscribe', function (data) {   //收到subscribe消息，操作mqtt客户端订阅响应的话题
    console.log('Subscribing to '+data.topic);
    client.subscribe(data.topic);
  });
});
 
client.addListener('mqttData', function(topic, payload){ //当mqtt客户端收到消息
  sys.puts(topic+'='+payload);
  io.sockets.emit('mqtt',{'topic':String(topic), 
  'payload':String(payload)}); //向浏览器端发送mqtt消息并携带包含topic与paload的json字段

});
