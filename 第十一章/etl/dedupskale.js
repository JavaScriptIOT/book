var sc = require('skale').context();

sc.textFile('/my/path/*.txt')
  .flatMap(line => line.split(' '))
  .map(word => [word, 1])
  .reduceByKey((a, b) => a + b, 0)
  .count(function (err, result) {
    console.log(result);
    sc.end();
  });