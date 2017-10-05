var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client();

module.exports = function(chatServer, groupId) {

    var consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'chatmessages' }
        ],
        {
            groupId: groupId,
            autoCommit: true,
            autoCommitIntervalMs: 5000
        }
    );

    consumer.on('message', function (kafkaMessage) {
        console.log('Received message ' + kafkaMessage.value);
        var message = JSON.parse(kafkaMessage.value);
        chatServer.broadcast(message);
    });

    return {
        close : function() {
            console.log('Shutting down consumer');
            consumer.close(false, function() {
                console.log('Consumer closed');
                console.log('Shutting down consumer client');
                client.close(function() {
                    console.log('Consumer Client closed');
                });
            });
        }
    };
};

