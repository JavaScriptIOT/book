var LRU = require("lru-cache")
, options = { max: 500
			, length: function (n, key) { return n * 2 + key.length }
			, dispose: function (key, n) { n.close() }
			, maxAge: 1000 * 60 * 60 }
, cache = LRU(options)
, otherCache = LRU(50) // sets just the max size

cache.set("key", "value")
console.log(cache.get("key")) // "value"