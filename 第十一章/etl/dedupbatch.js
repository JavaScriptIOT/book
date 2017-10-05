String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var eclairjs = require('eclairjs');

var spark = new eclairjs();

var sc = new spark.SparkContext("local[*]", "Remove Duplcate Data");

var textFile = sc.textFile('data.txt');

var data = textFile.flatMap(function(sentence) {
      return sentence.split("\n");

});

var dataWithhash = data.mapToPair(function(word, Tuple2) {
      return new Tuple2(word.toString().hashCode, word);

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
