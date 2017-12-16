var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer; 
var Client = kafka.Client; 
var client = new Client('localhost:2181'); 
var topics = [{ topic: "test"}]; 
var options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 }; 
var consumer = new HighLevelConsumer(client, topics, options); 
consumer.on('message', function (message) { 
   console.log(message); 
}); 
consumer.on('error', function (err) { 
  console.log('error', err); 
}); 