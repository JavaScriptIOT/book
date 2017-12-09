var kafka = require('kafka-node'),
	HighLevelConsumer = kafka.HighLevelConsumer,
	kafkaclient = new kafka.Client();
HighLevelProducer = kafka.HighLevelProducer,
	producer = new HighLevelProducer(kafkaclient);
var mosca = require('mosca');
var moscaSettings = {
    port: 1883, //mosca (mqtt) port
};
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost')

var server = new mosca.Server(moscaSettings); //here we start mosca
server.on('ready', setup); //on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
	console.log('Mosca server is up and running')
}

client.on('connect', function () {
	client.subscribe('iot')
	client.publish('iot', 'Hello mqtt')
})

 client.on('error', function (error) {
 	console.log(error)
})

client.on('message', function (topic, message) {
	// message is Buffer
	console.log('Received in mqtt')
	console.log('Received mqtt topic ' + topic);
	console.log('Received mqtt message ' + message);
	var kafkaMessage = {
		topic: 'mqttin',
		key: topic,
		messages: message.toString()
	};
	producer.send([kafkaMessage], function (err, data) {
		if (err) {
			console.log('Error sending data ' + err);
		}
	});

})

var consumer = new HighLevelConsumer(
	kafkaclient,
	[{ topic: 'mqttout' }],
	{
		groupId: "mqttbridge",
		autoCommit: true,
		autoCommitIntervalMs: 5000
	}
);

consumer.on('message', function (kafkaMessage) {
	var message = kafkaMessage.value;
	var key = kafkaMessage.key
	console.log('Received in kafka')
	console.log('Received mqtt topic ' + key);
	console.log('Received mqtt message ' + message);
    client.subscribe(key)
    client.publish(key, message)
});
