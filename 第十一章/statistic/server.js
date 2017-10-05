var Cache = require('jscache');
var cache = new Cache({
	ttl: 120,    //default Time to live is 60
	refresh:20  //Default refresh rate. is 61
});

cache.set("test", "test");
cache.get("test")

