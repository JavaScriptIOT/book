var eclairjs = require('eclairjs');

var spark = new eclairjs();

var sc = new spark.SparkContext("local[*]", "Simple Word Count");

var textFile = sc.textFile('foo.txt');

var words = textFile.flatMap(function(sentence) {
      return sentence.split(" ");

});

var wordsWithCount = words.mapToPair(function(word, Tuple2) {
      return new Tuple2(word, 1);

}, [eclairjs.Tuple2]);

var reducedWordsWithCount = wordsWithCount.reduceByKey(function(value1, value2) {
      return value1 + value2;

});

reducedWordsWithCount.collect().then(function(results) {
      console.log('Word Count:', results);
      sc.stop();

});
