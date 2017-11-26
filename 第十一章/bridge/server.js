var kafka = require('kafka-node'),
HighLevelConsumer = kafka.HighLevelConsumer,
client = new kafka.Client();
HighLevelProducer = kafka.HighLevelProducer,
producer = new HighLevelProducer(client);
var mosca = require('mosca');
var moscaSettings = {
    port: 1883, //mosca (mqtt) port
};
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')

var server = new mosca.Server(moscaSettings); //here we start mosca
server.on('ready', setup); //on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
   console.log('Mosca server is up and running')
}

client.on('connect', function () {
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
		var kafkaMessage = {
			topic: 'mqtt',
			key: topic,
			messages : message.toString()
		};
		producer.send([kafkaMessage], function (err, data) {
			if(err) {
				console.log('Error sending data ' + err);
			}
		});
  client.end()
})

var consumer = new HighLevelConsumer(
	client,
	[{ topic: 'mqtt' }],
	{
		groupId: "mqttbridge",
		autoCommit: true,
		autoCommitIntervalMs: 5000
	}
);

consumer.on('message', function (kafkaMessage) {
	var message = kafkaMessage.value;
	var key = kafkaMessage.key
	console.log('Received key ' + kafkaMessage.key);
	console.log('Received message ' + message);
    client.subscribe(key)
    client.publish(key, message)
});
