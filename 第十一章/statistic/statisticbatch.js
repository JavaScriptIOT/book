var eclairjs = require('eclairjs');
var spark = new eclairjs();

var session = spark.sql.SparkSession.builder()
      .appName("Statistic batch")
      .getOrCreate();

var file = '/mnt/event';

var textFile = session.read().textFile(file).rdd();

var data = textFile.flatMap(function (sentence) {
      return sentence.split("\n");

});

var time = data
.map(function (timeString) {
      function timeWindow(timeString, window) {
            var date = new Date(timeString);
            date.setTime(date.getTime() - date.getTime() % window)
            return date.toString()
      }
      return timeWindow(timeString, 20000)
})

 var dataPair = time.mapToPair(function (time, Tuple2) {
       return new Tuple2(time, 1);
 }, [spark.Tuple2]);

var reduced = dataPair.reduceByKey(function (value1, value2) {
      return value1 + value2;
});

var result = reduced.map(function (pair) { return {time:pair._1(), statistic: pair._2()}});

result.collect().then(function (results) {
      console.log('Statistic results:', results);
      session.stop();
});