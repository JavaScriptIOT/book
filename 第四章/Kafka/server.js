var KafkaRest = require('kafka-rest');
var kafka = new KafkaRest({ 'url': 'http://localhost:8082' }); 
kafka.topics.topic('test'); 
kafka.topic('test').produce('message')
topic('test').produce({'key': 'key1', 'value': 'msg1', 'partition': 0},
   function(err,res){
   //...    
});

// With Avro data:
var userIdSchema = new KafkaRest.AvroSchema("int");
var userInfoSchema = new KafkaRest.AvroSchema({
    "name": "UserInfo",
    "type": "record",
    "fields": [
        { "name": "id", "type": "int" },
        { "name": "name", "type": "string" }]
});
// Avro value schema followed by messages containing only values
topic.produce(userInfoSchema, {'avro': 'record'}, {'avro': 'another record'});
// Avro key and value schema.
topic.produce(userIdSchema, userInfoSchema, {'key': 1, 'value': {'id': 1, 'name': 'Bob'}});
var stream = consumer_instance.subscribe('my-topic')
stream.on('data', function(msgs) {
    for(var i = 0; i < msgs.length; i++)
        console.log("Got a message: key=" + msgs[i].key + " value=" + msgs[i].value + " partition=" + msgs[i].partition);
});
stream.on('error', function(err) {
    console.log("Something broke: " + err);
});
