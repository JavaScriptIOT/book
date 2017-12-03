var eclairjs = require('eclairjs');
var spark = new eclairjs();

var session = spark.sql.SparkSession.builder()
      .appName("statistic batch")
      .getOrCreate();

var file = '/usr/local/spark-2.0.2-bin-hadoop2.7/README.md';

var textFile = session.read().textFile(file).rdd();

function timeWindow(timeStirng, window) {
      var date = new Date(timeStirng);
      date.setTime(date.getTime() - date.getTime() % window)
      return date.toString()
}
var data = textFile.flatMap(function (sentence) {
      return sentence.split("\n");
}).map( function (timeString) {
      return timeWindow(timeStirng,100) 
})

var dataWithhash = data.mapToPair(function (timestamp, Tuple2) {
      return new Tuple2(timestamp, 1);
}, [spark.Tuple2]);

var reduced = dataWithhash.reduceByKey(function (value1, value2) {
      return value1;
});

var result = reduced.map(function (pair) {return pair._2()});

result.collect().then(function (results) {
      console.log('statistic results:', results);
      session.stop();
}).catch(stop);

process.on('SIGTERM', stop);
process.on('SIGINT', stop);

function exit() {
      process.exit(0);
}

function stop(e) {
      if (e) {
            console.log('Error:', e);
      }
      if (session) {
            session.stop().then(exit).catch(exit);
      }
}

