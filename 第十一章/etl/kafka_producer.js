var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client(),
    producer = new HighLevelProducer(client);

module.exports = function(chatServer) {

    producer.on('ready', function () {
        chatServer.on('sendMessage', function (message) {

            var messageString = JSON.stringify(message);
            console.log('Sending message ' + messageString );

            var kafkaMessage = {
                topic: 'chatmessages',
                messages : messageString
            };

            producer.send([kafkaMessage], function (err, data) {
                if(err) {
                    console.log('Error sending data ' + err);
                }
            });
        });
    });

    return {
        close : function() {
            console.log('Shutting down producer');
            console.log('Shutting down producer client');
            client.close(function() {
                console.log('Producer client closed');
            });

        }
    };
};