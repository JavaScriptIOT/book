var kafka = require('kafka-node'),
    Producer = kafka.Producer,      
    client = new kafka.Client(),
    producer = new Producer(client); 
producer.createTopics(['test'], false, function (err, data) {
    console.log(data);
});