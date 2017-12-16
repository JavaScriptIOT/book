var microtime = require('microtime')
var t1 = microtime.now()
var delay = microtime.now() - t1 
console.log(t1)
console.log(delay)