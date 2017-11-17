var sc = require('skale').context();

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

sc.textFile('./*.js')
	.flatMap(line => line.split(' '))
	.map(word => [hashCode[word], word])
	.reduceByKey((a, b) => a, 0)
	.collect(function (err, result) {
		console.log(result);
		sc.end();
});