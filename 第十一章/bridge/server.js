var mosca = require('mosca');
var moscaSettings = {
    port: 1883, //mosca (mqtt) port
};

var server = new mosca.Server(moscaSettings); //here we start mosca
server.on('ready', setup); //on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
   console.log('Mosca server is up and running')
}


var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

