var kafka = require('kafka-node'),
	HighLevelConsumer = kafka.HighLevelConsumer,
	client = new kafka.Client();

var elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'info'
});

HighLevelConsumer = kafka.HighLevelConsumer,
	kafkaclient = new kafka.Client();

var consumer = new HighLevelConsumer(
	kafkaclient,
	[
		{ topic: 'messages' }
	],
	{
		groupId: "debupelastic",
		autoCommit: true,
		autoCommitIntervalMs: 5000
	}
);

function hashCode(v) {
	var hash = 0, i, chr;
	if (v.length === 0) return hash;
	for (i = 0; i < v.length; i++) {
		chr = v.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

consumer.on('message', function (kafkaMessage) {
	console.log('Received key ' + kafkaMessage.key);
	console.log('Received message ' + kafkaMessage.value);
	var message = JSON.parse(kafkaMessage.value);
	var key = hash(message);
	client.create({
		index: 'debupelastic',
		type: 'log',
		id: hashCode(message),
		body: message
	}, function (error, response) {
		if (error) console.log('send error')
	});
});



