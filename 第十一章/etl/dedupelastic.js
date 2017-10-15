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

consumer.on('message', function (kafkaMessage) {
	console.log('Received key ' + kafkaMessage.key);
	console.log('Received message ' + kafkaMessage.value);
	var message = JSON.parse(kafkaMessage.value);
	var key = hash(message);
	client.create({
	  index: 'message',        
	  type: 'log',           
	  id: key,                   
	  body: message}, function (error, response) {
	  if (error) console.log('send error')
	});
});



