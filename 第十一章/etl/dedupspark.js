var eclairjs = require('eclairjs');
var spark = new eclairjs();

var session = spark.sql.SparkSession.builder()
      .appName("Remove duplcation")
      .getOrCreate();

var file = '/mnt/event';
// https://www.codementor.io/agustinchiappeberrini/lazy-evaluation-and-javascript-a5m7g8gs3
var lazy = function (creator) {
  var res;
  var processed = false;
  return function () {
    if (processed) return res;
    res = creator.apply(this, arguments);
    processed = true;
    return res;
  };
};


var textFile = session.read().textFile(file).rdd();

var data = textFile.flatMap(function (sentence) {
      return sentence.split("\n");

});

var dataWithhash = data.mapToPair(function (word, Tuple2) {
      function hashCode(v) {
            var hash = 0, i, chr;
            if (v.length === 0) return hash;
            for (i = 0; i < v.length; i++) {
                  chr = v.charCodeAt(i);
                  hash = ((hash << 5) - hash) + chr;
                  hash |= 0; // Convert to 32bit integer
            }
            return hash;
      };
      return new Tuple2(hashCode(word), word);

}, [spark.Tuple2]);

var reducedWithHash = dataWithhash.reduceByKey(function (value1, value2) {
      return value1;
});

var result = reducedWithHash.map(function (pair) {return pair._2()});

result.collect().then(function (results) {
      console.log('dedup results:', results);
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


