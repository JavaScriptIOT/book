var eclairjs = require('eclairjs');
var spark = new eclairjs();

var sc = new spark.SparkContext("local[*]", "Statistic batch");

var event = [
      "2017-07-15T12:42:04+11:00",
      "2017-07-15T12:42:04+12:00",
      "2017-07-15T12:42:04+13:00",
      "2017-07-15T12:42:04+14:00",
      "2017-07-15T12:42:04+15:00",
      "2017-07-16T12:42:04+15:00",
      "2017-07-16T12:42:04+15:00",
      "2017-07-16T12:42:04+15:00",
      "2017-07-16T12:42:04+15:00"
]

var eventRDD = sc.parallelize(event);

var data = eventRDD
.map(function (timeString) {
      function timeWindow(timeString, window) {
            var date = new Date(timeString);
            date.setTime(date.getTime() - date.getTime() % window)
            return date.toString()
      }
      return timeWindow(timeString, 20000)
})

 var dataPair = data.mapToPair(function (time, Tuple2) {
       return new Tuple2(time, 1);
 }, [spark.Tuple2]);

var reduced = dataPair.reduceByKey(function (value1, value2) {
      return value1 + value2;
});

var result = reduced.map(function (pair) { return {time:pair._1(), statistic: pair._2()}});

result.collect().then(function (results) {
      console.log('Statistic results:', results);
      sc.stop();
});