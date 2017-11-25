var sc = require('skale-engine').context();
sc.textFile('./*.js')
	.flatMap(function split(line) {
		return line.split(' ')
	})
	.map(function map(word) {
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
		return [hashCode(word), word]
	})
	.reduceByKey((a, b) => b, "")
	.collect(function (err, result) {
		console.log(result);
		sc.end();
	});