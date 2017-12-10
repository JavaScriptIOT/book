var LRU = require("lru-cache")
, options = { max: 500
			, maxAge: 1000 * 60 * 60 }
, cache = LRU(options)
, otherCache = LRU(50) // sets just the max size
var hash  = require('object-hash');
var kafka = require('kafka-node'),
HighLevelConsumer = kafka.HighLevelConsumer,
client = new kafka.Client();
HighLevelProducer = kafka.HighLevelProducer,
producer = new HighLevelProducer(client);

var consumer = new HighLevelConsumer(
	client,
	[
		{ topic: 'messages' }
	],
	{
		groupId: "debupkafka",
		autoCommit: true,
		autoCommitIntervalMs: 5000
	}
);

consumer.on('message', function (kafkaMessage) {
	console.log('Received key ' + kafkaMessage.key);
	console.log('Received message ' + kafkaMessage.value);
	var message = kafkaMessage.value;
	var key = hash(message.toString());
	if (cache.get(key)) {
		return;
	} else {
		cache.set(key, message)
		var kafkaMessage = {
			topic: 'dedupmessages',
			messages : message
		};

		producer.send([kafkaMessage], function (err, data) {
			if(err) {
				console.log('Error sending data ' + err);
			}
		});
	}
});
