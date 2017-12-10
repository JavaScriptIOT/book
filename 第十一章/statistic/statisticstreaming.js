
var kafka = require('kafka-node'),
      HighLevelConsumer = kafka.HighLevelConsumer,
      client = new kafka.Client();
var hash = require('object-hash');
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
            groupId: "statisticstreaming",
            autoCommit: true,
            autoCommitIntervalMs: 5000
      }
);

function timeWindow(timeString, window) {
      var date = new Date(timeString);
      date.setTime(date.getTime() - date.getTime() % window)
      return date.toString()
}

consumer.on('message', function (kafkaMessage) {
      console.log('Received key ' + kafkaMessage.key);
      console.log('Received message ' + kafkaMessage.value);
      var message = kafkaMessage.value;
      var id = timeWindow(message, 1000);
      var index = 'statistic';
      var type = 'log'
      var count = 1;
      esclient.exists({
            index: index,
            type: type,
            id: id
      }, function (error, exists) {
            if (exists === true) {
                  esclient.update({
                        index: index,
                        type: type,
                        id: id,
                        body: {
                              "script": {
                                    "source": "ctx._source.counter += params.count",
                                    "lang": "painless",
                                    "params": {
                                          "count": count
                                    }
                              }
                        }
                  }, function (error, response) {
                        console.log(response)
                  })
            } else {
                  esclient.index({
                        index: index,
                        type: type,
                        id: id,
                        body: {
                              counter: count,
                        }
                  }, function (error, response) {
                        console.log(response)
                  });
            }
      });
});