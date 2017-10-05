var hash = require('object-hash');
var eclairjs = require('eclairjs');

var spark = new eclairjs();

var sc = new spark.SparkContext("local[*]", "Remove Duplcate Data");

var textFile = sc.textFile('data.txt');

var data = textFile.flatMap(function(sentence) {
      return sentence.split("\n");

});

var dataWithhash = data.mapToPair(function(word, Tuple2) {
      return new Tuple2(hash(word), word);

}, [eclairjs.Tuple2]);

var reducedWithhash = dataWithhash.reduceByKey(function(value1, value2) {
      if(value1 == value2)
          return value1;
      return value1 + " " + value2;

});

reducedWithhash.collect().then(function(results) {
      console.log('Word Count:', results);
      sc.stop();
});
