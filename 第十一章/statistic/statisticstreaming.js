
function exit() {
      process.exit(0);
}

function stop(e) {
      if (e) {
            console.log('Error:', e);
      }

      if (sparkContext) {
            sparkContext.stop().then(exit).catch(exit);
      }
}

var kafkaHost = 'localhost:9092';
var topic = 'dedupmessages';

var elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'info'
});

var eclairjs = require('eclairjs');
var spark = new eclairjs();

var sparkContext = new spark.SparkContext("local[*]", "Statistic Streaming");
var ssc = new spark.streaming.StreamingContext(sparkContext, new spark.streaming.Duration(2000));

var messages = spark.streaming.kafka.KafkaUtils.createStream(ssc, "wordcount", kafkaHost, topic);

var lines = messages.map(function (tuple2) {
      return tuple2._2();
});

var words = lines.flatMap(function (x) {
      return x.split(/\s+/);
});

var wordCounts = words.mapToPair(function (s, Tuple2) {
      return new Tuple2(s, 1);
}, [spark.Tuple2]).reduceByKey(function (i1, i2) {
      return i1 + i2;
});

wordCounts.foreachRDD(function (rdd) {
      return rdd.collect()
}, null, function (res) {
      console.log('Results: ', res)
      client.update({
            index: 'myindex',
            type: 'mytype',
            id: '1',
            body: {
                  doc: {
                        title: 'Updated'
                  }
            }
      }, function (error, response) {

      })
}).then(function () {
      ssc.start();
}).catch(stop);

// stop spark streaming when we stop the node program
process.on('SIGTERM', stop);